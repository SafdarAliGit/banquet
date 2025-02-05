frappe.ui.form.on('Sales Order', {
    refresh(frm) {
        
    },
    custom_hst:function(frm){
        if(frm.doc.custom_hst){
            set_service_charges(frm);
            set_balance(frm);
        }
    },
    custom_cost:function(frm){
        if(frm.doc.custom_cost){
            set_service_charges(frm);
            set_balance(frm);
        }
    },
    custom_deposit:function(frm){
        if(frm.doc.custom_deposit){
            set_balance(frm);
        }
    }
})

function set_service_charges(frm){ 
    let custom_hst = cint(frm.doc.custom_hst) || 0;
    let custom_cost = cint(frm.doc.custom_cost) || 0;
    frm.set_value("custom_service_charges", custom_hst + custom_cost);
}

function set_balance(frm){ 
    let service_charges = cint(frm.doc.custom_service_charges) || 0;
    let deposit = cint(frm.doc.custom_deposit) || 0;
    frm.set_value("custom_balance_", service_charges - deposit);
}