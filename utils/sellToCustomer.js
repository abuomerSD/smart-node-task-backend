const { conn, sequelize } = require('../db/conn');
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
let utils = {}
utils.sell_to_customer = (customer, accountReceivable,customersUnearned, accounting_transaction, transaction,accounting_period_id, products_fees, sale_order, amount) => {
	return new Promise(async resolve => {
  
	  let old_invoices = [], old_prepayments
	
	  const previous_receivable = customer && customer?.id ? (await sequelize.query(`   
		    SELECT
		  (
			  COALESCE((
				  select
			 COALESCE(SUM(value),0)
  
				  from
				  subledger_transactions
				  where
					  type = 'debit'
					  and subledger_subaccounts_id = ${accountReceivable.id}
					  and record_id =${customer.id}
			  ),0) -COALESCE((
				  select
			   COALESCE(SUM(value),0)
  
				  from
				  subledger_transactions
				  where
					  type = 'credit'
					  and subledger_subaccounts_id = ${accountReceivable.id}
					  and record_id = ${customer.id}
                    ),0)
		  ) tot;
	  `))[0][0].tot - products_fees : 0
	  const unearned_revenue = customer && customer?.id ? (await sequelize.query(`
	  
	  SELECT
		  (
			  COALESCE((
				  select
					  COALESCE(SUM(value),0)
				  from
					  subledger_transactions
				  where
					  type = 'credit'
					  and subledger_subaccounts_id = ${customersUnearned.id}
					  
					  and record_id = ${customer.id}
			  ),0) -COALESCE((
				  select
					  COALESCE(SUM(value),0)
				  from
					  subledger_transactions
				  where
					  type = 'debit'
					  and subledger_subaccounts_id = ${customersUnearned.id}
					  
					  and record_id = ${customer.id}
			  ),0)
		  ) tot;
	  
	  
	  `))[0][0].tot : 0
	      // debit the cash account
    // await conn.transaction_details.create(
    //   {
    //     account_id: cash_id,
    //     type: "debit",
    //     value: amount,
    //     descr: `دفع فاتورة ${customer?.name}`,
    //     descr_en: `pay ${customer?.name} bill`,
    //     transaction_id: accounting_transaction.id,
    //   },
    //   { transaction }
    // );
	  
	
		
		old_invoices = customer && customer?.id ? await conn.sale_order.findAll({
            order: [['id', 'DESC']],
			raw:true,
			where: { 
			  customer_id: customer?.id ,
			  total_amount:{
				[Op.ne]:Sequelize.col('paid_amount')
			  }
			},
		  }):[];

  if(sale_order){
	old_invoices.push(sale_order)
  }
  
  
  
	  console.log("old_invoices", old_invoices)
  
  
  
	  let total_cash_paid = 0
  
	  total_cash_paid = amount
  
	  console.log('step 919 :', {
		previous_receivable,
		unearned_revenue,
		customersUnearned,
		total_cash_paid,
		products_fees,
		old_invoices
	  });
  
  
	  if (previous_receivable > 0 && parseFloat(total_cash_paid) > (previous_receivable + products_fees)) {
		console.log('case 1');
		await sequelize.query(`
		INSERT INTO transaction_details(
		  account_id,
		  type,
		  value,
		  transaction_id,
		  descr,
		  descr_en
	  )
	  VALUES
		  
		  (${accountReceivable.level_three_chart_of_account_id}, 'credit', ${parseFloat(products_fees) + parseFloat(previous_receivable)},${accounting_transaction.id},'${`دفع فاتورة ${customer?.name}`}','${`pay ${customer?.name} bill`}'),
		  (${customersUnearned.level_three_chart_of_account_id}, 'credit', ${parseFloat(total_cash_paid) - ((parseFloat(products_fees) + parseFloat(previous_receivable)))},${accounting_transaction.id},'ارباح غير مستخقة من فاتورة ${customer?.name}','unearned revenues from ${customer?.name} bill' )
		`,{transaction})
  
		if (customer && customer.id)
		  await sequelize.query(`
		INSERT INTO subledger_transactions(
		transaction_id,
		  subledger_id,
		  subledger_subaccounts_id,
		  accounting_period_id,
		  
		  record_id,
		  type,
		  value,
		  descr,
		  descr_en
	  ) VALUES 
		(${accounting_transaction.id},1,${accountReceivable.id},${accounting_period_id},${customer.id}, 'credit', ${parseFloat(products_fees) + parseFloat(previous_receivable)},'${`دفع فاتورة ${customer?.name}`}','pay ${customer?.name} bill'),
		(${accounting_transaction.id},1,${customersUnearned.id},${accounting_period_id},${customer.id}, 'credit', ${parseFloat(total_cash_paid) - (parseFloat(products_fees) + parseFloat(previous_receivable))}, 'ارباح غير مستخقة من فاتورة ${customer?.name}','unearned revenues from ${customer?.name} bill')
		`,{transaction})
  
		await utils.processOldCustomerInvoices( old_invoices, parseFloat(products_fees) + parseFloat(previous_receivable),transaction)
  
  
	  } else if (previous_receivable > 0 && parseFloat(total_cash_paid) != 0) {
		console.log('++ case 2');
		await sequelize.query(`
		INSERT INTO transaction_details(
		  account_id,
		  type,
		  value,
		  transaction_id,
		  descr,
		  descr_en
	  )
	  VALUES
		  (${accountReceivable.level_three_chart_of_account_id}, 'credit', ${parseFloat(total_cash_paid)},${accounting_transaction.id},
		  '${`دفع فاتورة ${customer?.name}`}','${`pay ${customer?.name} bill`}')
	  
		`,{transaction})
		if (customer && customer.id)
		  await sequelize.query(`
		INSERT INTO subledger_transactions(
		transaction_id,
		  subledger_id,
		  subledger_subaccounts_id,
		  accounting_period_id, 
		  record_id,
		  type,
		  value,
		  descr,
		  descr_en
	  ) VALUES 
		(${accounting_transaction.id},1,${accountReceivable.id},${accounting_period_id},${customer.id}, 'credit', ${parseFloat(total_cash_paid)},'${`دفع فاتورة ${customer?.name}`}','${`pay ${customer?.name} bill`}')
		
	  
		`,{transaction})
  
		await utils.processOldCustomerInvoices( old_invoices, parseFloat(total_cash_paid),transaction)
  
	  } else if (parseFloat(unearned_revenue) > 0 && parseFloat(total_cash_paid) > 0 && parseFloat(total_cash_paid) < products_fees && parseFloat(unearned_revenue) + parseFloat(total_cash_paid) > parseFloat(products_fees)) {
		console.log('case 3');
		await sequelize.query(`
		INSERT INTO transaction_details(
		  account_id,
		  type,
		  value,
		  transaction_id,
		  descr,
		  descr_en
	  )
	  VALUES
		  (${accountReceivable.level_three_chart_of_account_id}, 'credit', ${parseFloat(products_fees)},${accounting_transaction.id},
		  '${`دفع فاتورة ${customer?.name}`}','pay ${customer?.name} bill'),
		  (${customersUnearned.level_three_chart_of_account_id}, 'debit', ${parseFloat(products_fees) - parseFloat(total_cash_paid)},${accounting_transaction.id},'ارباح غير مستخقة من فاتورة ${customer?.name}','unearned revenues from ${customer?.name} bill')
		  
		`,{transaction})
		if (customer && customer.id)
		  await sequelize.query(`
		INSERT INTO subledger_transactions(
		transaction_id,
		  subledger_id,
		  subledger_subaccounts_id,
		  accounting_period_id,
		  
		  record_id,
		  type,
		  value,
		  descr,
		  descr_en
	  ) VALUES 
		(${accounting_transaction.id},1,${accountReceivable.id},${accounting_period_id},${customer.id}, 'credit', ${parseFloat(products_fees)},'${`دفع فاتورة ${customer?.name}`}','pay ${customer?.name} bill'),
  
	  
		(${accounting_transaction.id},1,${customersUnearned.id},${accounting_period_id},${customer.id}, 'debit', ${parseFloat(products_fees) - parseFloat(total_cash_paid)}, 'ارباح غير مستخقة من فاتورة ${customer?.name}','unearned revenues from ${customer?.name} bill')
  
	  
		`,{transaction})
  
  
		await utils.processOldCustomerInvoices( old_invoices, parseFloat(products_fees),transaction)
  
	  } else if (parseFloat(unearned_revenue) > 0 && total_cash_paid > 0 && parseFloat(total_cash_paid) < parseFloat(products_fees) && old_invoices.length > 0) {
		console.log('case 4');
		await sequelize.query(`
		INSERT INTO transaction_details(
		  account_id,
		  type,
		  value,
		  transaction_id,
		  descr,
		  descr_en
	  )
	  VALUES
		  (${accountReceivable.level_three_chart_of_account_id}, 'credit', ${parseFloat(unearned_revenue) + parseFloat(total_cash_paid)},${accounting_transaction.id},'${`دفع فاتورة ${customer?.name}`}','pay ${customer?.name} bill'),
  
				  
		  (${customersUnearned.level_three_chart_of_account_id}, 'debit', ${parseFloat(unearned_revenue)},${accounting_transaction.id},'ارباح غير مستخقة من فاتورة ${customer?.name}','unearned revenues from ${customer?.name} bill')
  
		  
		  
		  
	  
		`,{transaction})
		if (customer && customer.id)
		  await sequelize.query(`
		INSERT INTO subledger_transactions(
		transaction_id,
		  subledger_id,
		  subledger_subaccounts_id,
		  accounting_period_id,
		  
		  record_id,
		  type,
		  value,
		  descr,
		  descr_en
	  ) VALUES 
		(${accounting_transaction.id},1,${accountReceivable.id},${accounting_period_id},${customer.id}, 'credit', ${parseFloat(unearned_revenue) + parseFloat(total_cash_paid)},' ${`دفع فاتورة ${customer?.name}`}','pay ${customer?.name} bill'),
  
		
  
		(${accounting_transaction.id},1,${customersUnearned.id},${accounting_period_id},${customer.id}, 'debit', ${parseFloat(unearned_revenue)}, 'ارباح غير مستخقة من فاتورة ${customer?.name}','unearned revenues from ${customer?.name} bill')
  
	  
		`,{transaction})
  
		await utils.processOldCustomerInvoices( old_invoices, parseFloat(unearned_revenue) + parseFloat(total_cash_paid),transaction)
  
	  } else if (parseFloat(unearned_revenue) > 0 && total_cash_paid > 0 && parseFloat(total_cash_paid) == parseFloat(products_fees)) {
		console.log('case 5');
		await sequelize.query(`
		INSERT INTO transaction_details(
		  account_id,
		  type,
		  value,
		  transaction_id,
		  descr,
		  descr_en
	  )
	  VALUES
		  (${accountReceivable.level_three_chart_of_account_id}, 'credit', ${parseFloat(products_fees)},${accounting_transaction.id},
		  '${`دفع فاتورة ${customer?.name}`}','pay ${customer?.name} bill')
  
		  
		  
		  
		  
	  
		`,{transaction})
		if (customer && customer.id)
		  await sequelize.query(`
		INSERT INTO subledger_transactions(
		transaction_id,
		  subledger_id,
		  subledger_subaccounts_id,
		  accounting_period_id,
		  
		  record_id,
		  type,
		  value,
		  descr,
		  descr_en
	  ) VALUES 
		(${accounting_transaction.id},1,${accountReceivable.id},${accounting_period_id},${customer.id}, 'credit', ${parseFloat(products_fees)},' ${`دفع فاتورة ${customer?.name}`}','pay ${customer?.name} bill')
  
		
  
	  
		`,{transaction})
  
		await utils.processOldCustomerInvoices( old_invoices, parseFloat(products_fees),transaction)
  
	  } else if (parseFloat(unearned_revenue) > 0 && total_cash_paid > 0 && parseFloat(total_cash_paid) > parseFloat(products_fees) && old_invoices.length > 0) {
		console.log('case 6');
		await sequelize.query(`
		INSERT INTO transaction_details(
		  account_id,
		  type,
		  value,
		  transaction_id,
		  descr,
		  descr_en
	  )
	  VALUES
		  (${accountReceivable.level_three_chart_of_account_id}, 'credit', ${parseFloat(products_fees)},${accounting_transaction.id},
		  '${`دفع فاتورة ${customer?.name}`}','pay ${customer?.name} bill'),
  
		  
  
		  
		  (${customersUnearned.level_three_chart_of_account_id}, 'credit', ${parseFloat(total_cash_paid) - parseFloat(products_fees)},${accounting_transaction.id},'ارباح غير مستخقة من فاتورة ${customer?.name}','unearned revenues from ${customer?.name} bill')
  
		  
		  
		  
	  
		`,{transaction})
		if (customer && customer.id)
		  await sequelize.query(`
		INSERT INTO subledger_transactions(
		transaction_id,
		  subledger_id,
		  subledger_subaccounts_id,
		  accounting_period_id,	  
		  record_id,
		  type,
		  value,
		  descr,
		  descr_en
	  ) VALUES 
		(${accounting_transaction.id},1,${accountReceivable.id},${accounting_period_id},${customer.id}, 'credit', ${parseFloat(products_fees)},
		' ${`دفع فاتورة ${customer?.name}`}','pay ${customer?.name} bill'),
  
	  
		(${accounting_transaction.id},1,${customersUnearned.id},${accounting_period_id},${customer.id}, 'credit', ${parseFloat(total_cash_paid) - parseFloat(products_fees)}, 'ارباح غير مستخقة من فاتورة ${customer?.name}','unearned revenues from ${customer?.name} bill')
  
	  
		`,{transaction})
  
		await utils.processOldCustomerInvoices( old_invoices, parseFloat(products_fees),transaction)
  
  
	  } else if (parseFloat(unearned_revenue) > 0 && parseFloat(unearned_revenue) >= parseFloat(products_fees) && old_invoices.length > 0) {
		console.log('case 7');
		await sequelize.query(`
		INSERT INTO transaction_details(
		  account_id,
		  type,
		  value,
		  transaction_id,
		  descr,
		  descr_en
	  )
	  VALUES
		  (${accountReceivable.level_three_chart_of_account_id}, 'credit', ${parseFloat(products_fees)},${accounting_transaction.id},
		  '${`دفع فاتورة ${customer?.name}`}','pay ${customer?.name} bill'),
  
		  
  
		  
		  (${customersUnearned.level_three_chart_of_account_id}, 'debit', ${parseFloat(products_fees)},${accounting_transaction.id},'ارباح غير مستخقة من فاتورة ${customer?.name}','unearned revenues from ${customer?.name} bill')
		  
		`,{transaction})
		if (customer && customer.id)
		  await sequelize.query(`
		INSERT INTO subledger_transactions(
		transaction_id,
		  subledger_id,
		  subledger_subaccounts_id,
		  accounting_period_id,
		  
		  record_id,
		  type,
		  value,
		  descr,
		  descr_en
	  ) VALUES 
		(${accounting_transaction.id},1,${accountReceivable.id},${accounting_period_id},${customer.id}, 'credit', ${parseFloat(products_fees)},
		' ${`دفع فاتورة ${customer?.name}`}','pay ${customer?.name} bill'),
  
		
  
		(${accounting_transaction.id},1,${customersUnearned.id},${accounting_period_id},${customer.id}, 'debit', ${parseFloat(products_fees)}, 'ارباح غير مستخقة من فاتورة ${customer?.name}','unearned revenues from ${customer?.name} bill')
  
	  
		`,{transaction})
		await utils.processOldCustomerInvoices( old_invoices, parseFloat(products_fees),transaction)
  
  
	  } else if (parseFloat(unearned_revenue) > 0 && old_invoices.length > 0) {
		console.log('case 8');
		await sequelize.query(`
		INSERT INTO transaction_details(
		  account_id,
		  type,
		  value,
		  transaction_id,
		  descr,
		  descr_en
	  )
	  VALUES
		  (${accountReceivable.level_three_chart_of_account_id}, 'credit', ${parseFloat(unearned_revenue)},${accounting_transaction.id},
		  '${`دفع فاتورة ${customer?.name}`}','pay ${customer?.name} bill'),
  
		  
  
		  
		  (${customersUnearned.level_three_chart_of_account_id}, 'debit', ${parseFloat(unearned_revenue)},${accounting_transaction.id},'ارباح غير مستخقة من فاتورة ${customer?.name}','unearned revenues from ${customer?.name} bill')
		  
		`,{transaction})
		if (customer && customer.id)
		  await sequelize.query(`
		INSERT INTO subledger_transactions(
		transaction_id,
		  subledger_id,
		  subledger_subaccounts_id,
		  accounting_period_id,
		  
		  record_id,
		  type,
		  value,
		  descr,
		  descr_en
	  ) VALUES 
		(${accounting_transaction.id},1,${accountReceivable.id},${accounting_period_id},${customer.id}, 'credit', ${parseFloat(unearned_revenue)},' ${`دفع فاتورة ${customer?.name}`}','pay ${customer?.name} bill'),
  
		
  
		(${accounting_transaction.id},1,${customersUnearned.id},${accounting_period_id},${customer.id}, 'debit', ${unearned_revenue}, 'ارباح غير مستخقة من فاتورة ${customer?.name}','unearned revenues from ${customer?.name} bill')
  
	  
		`,{transaction})
  
		await utils.processOldCustomerInvoices( old_invoices, parseFloat(unearned_revenue),transaction)
  
  
	  } else if (parseFloat(total_cash_paid) > 0 && parseFloat(total_cash_paid) <= products_fees && old_invoices.length > 0) {
		console.log('++ case 9');
		await sequelize.query(`
		INSERT INTO transaction_details(
		  account_id,
		  type,
		  value,
		  transaction_id,
		  descr,
		  descr_en
	  ) 
	  VALUES
		  (${accountReceivable.level_three_chart_of_account_id}, 'credit', ${parseFloat(total_cash_paid)},${accounting_transaction.id},'${`دفع فاتورة ${customer?.name}`}','pay ${customer?.name} bill')
		`,{transaction})
		if (customer && customer.id)
		  await sequelize.query(`
		INSERT INTO subledger_transactions(
		transaction_id,
		  subledger_id,
		  subledger_subaccounts_id,
		  accounting_period_id,
		  
		  record_id,
		  type,
		  value,
		  descr,
		  descr_en
	  ) VALUES 
		(${accounting_transaction.id},1,${accountReceivable.id},${accounting_period_id},${customer.id}, 'credit', ${parseFloat(total_cash_paid)},' ${`دفع فاتورة ${customer?.name}`}','pay ${customer?.name} bill')
		`,{transaction})
  
		await utils.processOldCustomerInvoices( old_invoices, parseFloat(total_cash_paid),transaction)
  
	  } else if (parseFloat(total_cash_paid) > 0 && old_invoices.length > 0) {
		console.log('case 10');
		await sequelize.query(`
		INSERT INTO transaction_details(
		  account_id,
		  type,
		  value,
		  transaction_id,
		  descr,
		  descr_en
	  ) 
	  VALUES
		  (${accountReceivable.level_three_chart_of_account_id}, 'credit', ${parseFloat(products_fees)},${accounting_transaction.id},
		  '${`دفع فاتورة ${customer?.name}`}','pay ${customer?.name} bill'),
  
		  (${customersUnearned.level_three_chart_of_account_id}, 'credit', ${parseFloat(total_cash_paid) - parseFloat(products_fees)},${accounting_transaction.id},'ارباح غير مستخقة من فاتورة ${customer?.name}','unearned revenues from ${customer?.name} bill')
  
		  
		  
		  
	  
		`,{transaction})
		if (customer && customer.id)
		  await sequelize.query(`
		INSERT INTO subledger_transactions(
		transaction_id,
		  subledger_id,
		  subledger_subaccounts_id,
		  accounting_period_id,
		  
		  record_id,
		  type,
		  value,
		  descr,
		  descr_en
	  ) VALUES 
		(${accounting_transaction.id},1,${accountReceivable.id},${accounting_period_id},${customer.id}, 'credit', ${parseFloat(products_fees)},' ${`دفع فاتورة ${customer?.name}`}','pay ${customer?.name} bill'),
		(${accounting_transaction.id},1,${customersUnearned.id},${accounting_period_id},${customer.id}, 'credit', ${parseFloat(total_cash_paid) - parseFloat(products_fees)}, 'ارباح غير مستخقة من فاتورة ${customer?.name}','unearned revenues from ${customer?.name} bill')
		`,{transaction})
  
  
		await utils.processOldCustomerInvoices( old_invoices, parseFloat(products_fees),transaction)
  
	  } else if (parseFloat(total_cash_paid) > 0) {
  
		console.log('case 11');
  
		await sequelize.query(`
		INSERT INTO transaction_details(
		  account_id,
		  type,
		  value,
		  transaction_id,
		  descr,
		  descr_en
	  ) 
	  VALUES
		  
  
		  (${customersUnearned.level_three_chart_of_account_id}, 'credit', ${parseFloat(total_cash_paid)},${accounting_transaction.id},'ارباح غير مستخقة من فاتورة ${customer?.name}','unearned revenues from ${customer?.name} bill')
   
		  
		  
		
	  
		`,{transaction})
		if (customer && customer.id)
  
		  await sequelize.query(`
		INSERT INTO subledger_transactions(
		transaction_id,
		  subledger_id,
		  subledger_subaccounts_id,
		  accounting_period_id,
		  
		  record_id,
		  type,
		  value,
		  descr,
		  descr_en
	  ) VALUES 
		
		(${accounting_transaction.id},1,${customersUnearned.id},${accounting_period_id},${customer.id}, 'credit', ${parseFloat(total_cash_paid) - parseFloat(products_fees)}, 'ارباح غير مستخقة من فاتورة ${customer?.name}','unearned revenues from ${customer?.name} bill')
	  
		`,{transaction})
  
  
		await utils.processOldCustomerInvoices(old_invoices, parseFloat(products_fees),transaction)
  
	  }
	  resolve()
	})
  }
  utils.processOldCustomerInvoices = (invoices, remaining_balance, transaction) => { // 1,000,000 [400,000 , 500,000 , 300,000 , 60,000]
	return new Promise(async resolve => {
		let can_be_paid = 0;
		remaining_balance = parseFloat(remaining_balance)
		console.log("invoices.length", invoices.length)
		for (let i = 0; i < invoices.length; i++) {
			invoices[i].total_amount = parseFloat(invoices[i].total_amount)
			invoices[i].paid_amount = parseFloat(invoices[i]?.paid_amount)
			if (remaining_balance > 0) {
				if (
					remaining_balance -
					(invoices[i].total_amount- invoices[i]?.paid_amount) >=
					0
				)
					can_be_paid = invoices[i].total_amount - invoices[i]?.paid_amount;

				else {
					can_be_paid = remaining_balance;
				}
				console.log("can_be_paid", can_be_paid, "remaining_balance", remaining_balance)

				
				await conn.sale_order.update(
					{
						paid_amount:
							can_be_paid + parseFloat((invoices[i]?.paid_amount ? invoices[i]?.paid_amount : 0)),
					},
					{
						where: {
							id: invoices[i]?.id
						},
						transaction
					},

				);
				console.log(115)
				// calculate gain and loss on this bill
				
				console.log(120)
				remaining_balance -= can_be_paid;
			}
			else
				break
		}
		console.log(126)
		
		console.log(159)
		resolve()
	})
}
module.exports = utils