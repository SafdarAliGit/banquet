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


frappe.ui.form.on("Sales Invoice Item", {
  // triggered when row is added / when row field changes
  custom_is_elastic:function(frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    toggle_read_only_child(frm, row);
  },
  rate:function(frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    toggle_read_only_child(frm, row);
  },
  qty:function(frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    toggle_read_only_child(frm, row);
  },
  item_code:function(frm, cdt, cdn) {
    const row = locals[cdt][cdn];
    toggle_read_only_child(frm, row);
  }
});

function toggle_read_only_child(frm, row) {
  const isReadOnly = !!row.custom_is_elastic;
  // for the field in the child table, specify table_field name = "items"
  frm.set_df_property('qty', 'read_only', isReadOnly, frm.doc.name, 'items', row.name);
  frm.set_df_property('rate', 'read_only', isReadOnly, frm.doc.name, 'items', row.name);
  // Refresh just that grid
  frm.fields_dict["items"].grid.refresh();
}
