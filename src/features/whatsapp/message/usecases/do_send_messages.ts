import { WhatsAppConnection } from "../../connection/config/whatsapp_connection";
import { ContactModel, SentStatus } from "../data/models/contact_model";

const nameTag = /<nome>/gi;

export class SendMessagesParams {
  contactList: Array<ContactModel>;
  message: string;

  constructor(contactList: Array<ContactModel>, message: string) {
    this.contactList = contactList;
    this.message = message;
  }
}

export class SendMessagesReturnItem {
  name: string;
  success: boolean;

  constructor(name: string, success: boolean) {
    this.name = name;
    this.success = success;
  }

  toJson() {
    return {
      name: this.name,
      success: this.success,
    };
  }
}

export class DoSendMessages {
  whatsAppConnection: WhatsAppConnection;

  constructor(whatsAppConnection: WhatsAppConnection) {
    this.whatsAppConnection = whatsAppConnection;
  }

  async execute(params: SendMessagesParams) {
    const returnContactList: Array<ContactModel> = [];
    for (var i in params.contactList) {
      var contact = params.contactList[i];
      var msg = params.message.replace(nameTag, contact.name);
      if (contact.status != SentStatus.success) {
        console.log(contact);
        try {
          await this.whatsAppConnection.sendMessage(contact.phone, msg);
          returnContactList.push(
            new ContactModel(
              contact.idContact,
              contact.name,
              contact.phone,
              SentStatus.success
            )
          );
        } catch (e) {
          console.error(e);
          returnContactList.push(
            new ContactModel(
              contact.idContact,
              contact.name,
              contact.phone,
              SentStatus.failed
            )
          );
        }
      } else {
        returnContactList.push(contact);
      }
    }
    console.log("Messages sent");
    return returnContactList;
  }
}
