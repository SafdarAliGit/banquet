import frappe
import requests
from frappe.utils import get_url

def send_invoice_via_whatsapp(doc, method):
    settings = frappe.get_doc("Twilio Settings")
    # Only for Sales Invoice (adjust doctype if needed)
    if doc.doctype != "Sales Invoice":
        return

    # Get mobile number field from document
    mobile = "+923087618131"
    # if doc.contact_mobile:
    #     mobile = doc.contact_mobile
    # elif doc.customer_mobile:
    #     mobile = doc.customer_mobile

    if not mobile:
        frappe.logger().info(f"No mobile number for {doc.doctype} {doc.name}, skipping WhatsApp")
        return

    # Ensure country code
    if not mobile.startswith("+"):
        frappe.throw("Mobile number must include country code (e.g. +92…)")

    # Generate PDF
    print_format = "Standard"  # customise this to your print format
    pdf_content = frappe.get_print(
        doc.doctype, doc.name,
        print_format=print_format,
        as_pdf=True
    )

    # Create File record to get URL
    file_doc = frappe.get_doc({
        "doctype": "File",
        "file_name": f"{doc.name}.pdf",
        "attached_to_doctype": doc.doctype,
        "attached_to_name": doc.name,
        "content": pdf_content,
        "is_private": 0
    }).insert(ignore_permissions=True)

    # Build file URL
    file_url = f"https://banquet.thesmarterp.com/private/files/{file_doc.file_url}"

    # Twilio API config
    account_sid = settings.account_sid
    auth_token = settings.auth_token
    from_whatsapp = settings.whatsapp_no
    to_whatsapp = f"whatsapp:{mobile}"

    # Use Twilio Python SDK or REST call
    # Example using REST:
    url = "https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json".format(account_sid=account_sid)
    data = {
        "From": from_whatsapp,
        "To": to_whatsapp,
        # For media / document, Twilio supports sending a media URL
        "Body": f"Dear customer, here is your invoice {doc.name}.",
        "MediaUrl": file_url
    }
    # Use requests or twilio-rest SDK
    resp = requests.post(url, data=data, auth=(account_sid, auth_token))

    if resp.status_code >= 400:
        frappe.log_error(message=resp.text, title=f"WhatsApp send failed for {doc.doctype} {doc.name}")
        frappe.throw("Failed to send WhatsApp message. Check logs.")
    else:
        frappe.msgprint(f"WhatsApp invoice sent to {mobile} for {doc.name}")
