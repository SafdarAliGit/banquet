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


// frappe.ui.form.on("Sales Invoice Item", {
//   // triggered when row is added / when row field changes
//   custom_is_elastic:function(frm, cdt, cdn) {
//     toggle_read_only(frm, cdt, cdn);
//   },
//   rate:function(frm, cdt, cdn) {
//     toggle_read_only(frm, cdt, cdn);
//   },
//   qty:function(frm, cdt, cdn) {
//     toggle_read_only(frm, cdt, cdn);
//   },
//   item_code:function(frm, cdt, cdn) {
//     toggle_read_only(frm, cdt, cdn);
//   }
// });

// function toggle_read_only(frm, cdt, cdn) {
//     let row = locals[cdt][cdn];
//     if (!row) return;
    
//     // Find the grid row in DOM
//     let grid_row = frm.fields_dict.items.grid.grid_rows_by_docname[cdn];
//     if (!grid_row) return;
    
//     let qty_field = grid_row.get_field('qty');
//     let rate_field = grid_row.get_field('rate');
    
//     if (row.custom_is_elastic) {
        
//         // Make fields read-only
//         if (qty_field) qty_field.df.read_only = 1;
//         if (rate_field) rate_field.df.read_only = 1;
        
//         // Refresh the fields
//         if (qty_field) qty_field.refresh();
//         if (rate_field) rate_field.refresh();
//     } else { 
//         // Refresh the fields
//         if (qty_field) qty_field.refresh();
//         if (rate_field) rate_field.refresh();
//     }
// }
