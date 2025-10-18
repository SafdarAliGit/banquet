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


frappe.ui.form.on('Sales Order Item', {
    custom_is_elastic: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        toggle_read_only(frm, row);
    },
    item_code: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        toggle_read_only(frm, row);
    },
    items_add: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        toggle_read_only(frm, row);
    },
    items_remove: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        toggle_read_only(frm, row);
    }
});
// Utility function to toggle read-only fields
function toggle_read_only(frm, row) {
    // Determine the read-only status based on the row's condition
    let isReadOnly = Boolean(row.custom_is_elastic);
    
    // Use set_df_property to change the read_only state and refresh the field
    frm.set_df_property('qty', 'read_only', isReadOnly, row.name);
    frm.set_df_property('rate', 'read_only', isReadOnly, row.name);
    
    // Refresh the items table to reflect the visual change
    frm.refresh_field('items');
}
