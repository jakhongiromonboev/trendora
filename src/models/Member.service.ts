import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import { LoginInput, Member, MemberInput } from "../libs/types/member";
import MemberModel from "../schema/Member.model";
import * as bcrypt from "bcrypt";

class MemberService {
  private readonly memberModel;
  constructor() {
    this.memberModel = MemberModel;
  }

  /** SSR --> ADMIN **/

  public async processSignup(input: MemberInput): Promise<Member> {
    const exist = await this.memberModel.findOne({
      memberType: MemberType.ADMIN,
    });
    if (exist) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }

    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

    try {
      const result = await this.memberModel.create(input);
      result.memberPassword = "";
      return result;
    } catch (err) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async processLogin(input: LoginInput): Promise<Member> {
    const member = await this.memberModel
      .findOne(
        {
          $or: [
            { memberNick: input.memberNick },
            { memberEmail: input.memberEmail },
          ],
        },
        { memberNick: 1, memberPassword: 1, memberEmail: 1 }
      )
      .exec();

    console.log("member:", member);
    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

    const isMatch = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword
    );
    console.log("isMatch:", isMatch);

    if (!isMatch) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return await this.memberModel.findById(member._id).exec();
  }
}

export default MemberService;
