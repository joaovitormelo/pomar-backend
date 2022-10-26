export enum SentStatus {
  unset,
  success,
  failed,
}

export class ContactModel {
  idContact: number;
  name: string;
  phone: string;
  status: SentStatus;

  constructor(
    idContact: number,
    name: string,
    phone: string,
    status: SentStatus
  ) {
    this.idContact = idContact;
    this.name = name;
    this.phone = phone;
    this.status = status;
  }

  static fromJson(json) {
    var status: SentStatus;
    if (json.status == 0) {
      status = SentStatus.unset;
    } else if (json.status == 1) {
      status = SentStatus.success;
    } else {
      status = SentStatus.failed;
    }
    return new ContactModel(json.id_contact, json.name, json.phone, status);
  }

  toJson() {
    var status: number;
    if (this.status == SentStatus.unset) {
      status = 0;
    } else if (this.status == SentStatus.success) {
      status = 1;
    } else {
      status = 2;
    }
    if (this.status)
      return {
        id_contact: this.idContact,
        name: this.name,
        phone: this.phone,
        status: status,
      };
  }
}
