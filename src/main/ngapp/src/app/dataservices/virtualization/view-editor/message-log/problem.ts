import { MessageType } from "@dataservices/virtualization/view-editor/message-log/message-type.enum";
import { Message } from "@dataservices/virtualization/view-editor/message-log/message";

export class Problem {

  public static readonly ERR0100 = new Problem( "ERR0100",
                                                MessageType.ERROR,
                                                "There must be a virtualization selected in order to use this editor." );
  public static readonly ERR0110 = new Problem( "ERR0110",
                                                MessageType.ERROR,
                                                "A view must have a name." );

  private readonly _id: string;
  private readonly _description: string;
  private readonly _type: MessageType;

  public constructor( id: string,
                      type: MessageType,
                      description: string ) {
    this._id = id;
    this._type = type;
    this._description = description;
  }

  /**
   * @returns {string} the description
   */
  public get description(): string {
    return this._description;
  }

  /**
   * @returns {string} the identifier
   */
  public get id(): string {
    return this._id;
  }

  /**
   * @returns {string} the type
   */
  public get type(): MessageType {
    return this._type;
  }

}
