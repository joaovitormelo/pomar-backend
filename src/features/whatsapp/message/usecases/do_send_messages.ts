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

      try {
        var phone = contact.phone
          .replace("(", "")
          .replace(")", "")
          .replace("-", "")
          .replace(" ", "");
        var name = contact.name.split(" ")[0].toLowerCase();
        name = name.charAt(0).toUpperCase() + name.slice(1);
        var msg = params.message.replace(nameTag, name);
        if (contact.status != SentStatus.success) {
          console.log(contact);
          await this.whatsAppConnection.sendMessage(phone, msg);
          returnContactList.push(
            new ContactModel(
              contact.idContact,
              contact.name,
              contact.phone,
              SentStatus.success
            )
          );
        } else {
          returnContactList.push(contact);
        }
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
    }
    console.log("Messages sent");
    return returnContactList;
  }
}
