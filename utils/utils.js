const { conn, sequelize } = require("../db/conn");

let utils = {}
utils.escape_str=function(str) {
	if(!str) return ''
	return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
		switch (char) {
			case "\0":
				return "\\0";
			case "\x08":
				return "\\b";
			case "\x09":
				return "\\t";
			case "\x1a":
				return "\\z";
			case "\n":
				return "\\n";
			case "\r":
				return "\\r";
			case "\"":
			case "'":
			case "\\":
			case "%":
				return "\\"+char;
		}
	});
}
utils.createPOSChartOfAccounts = (chart_of_accounts,pos_station_id, default_l2_revenue_root_id , pos_revenue_categorization_id)=>{
	return new Promise(async resolve => {
		console.log("chart_of_accounts",chart_of_accounts)
		for(let i=0;i<chart_of_accounts.length;i++){
			let main_type = chart_of_accounts[i]
			if(main_type.children && main_type.children.length>0) {
				for(let i=0;i<main_type.children.length;i++){
					let levelOne = main_type.children[i]
					let resp = (await sequelize.query(
						`insert into pos_level_one_chart_of_accounts(pos_station_id,pos_main_chart_of_accounts_type_id,name,name_en,code,is_editable) values(${pos_station_id},'${main_type.id}','${utils.escape_str(levelOne.name.toString().trim())}','${utils.escape_str(levelOne.name_en.toString().trim())}','${utils.escape_str(levelOne.code.toString().trim())}',${levelOne.is_editable})`,
					))[0]
					levelOne.server_id = resp[0]
					console.log("level one inserted",levelOne)
					if(levelOne.children && levelOne.children.length>0){
						for(let i=0;i<levelOne.children.length;i++){
							let leveTwo = levelOne.children[i]
							resp = (await sequelize.query(
								`insert into pos_level_two_chart_of_accounts(pos_level_one_chart_of_account_id ,name,name_en,code,is_editable) values('${levelOne.id}','${utils.escape_str(levelTwo.name.toString().trim())}','${utils.escape_str(levelTwo.name_en.toString().trim())}','${utils.escape_str(levelTwo.code.toString().trim())}',${levelTwo.is_editable})`,
							))[0]
							leveTwo.server_id = resp[0]
							if(levelTwo.id == default_l2_revenue_root_id && pos_revenue_categorization_id == 1){
								await sequelize.query(
									`insert into pos_level_three_chart_of_accounts(pos_level_two_chart_of_account_id,name,name_en,code) values('${levelTwo.id}','عوائد المبيعات','Sales Revenues','411002')`,
								)
							}
							console.log("level two inserted",leveTwo)
							if(leveTwo.children && leveTwo.children.length>0){
								for(let i=0;i<leveTwo.children.length;i++){
									let leveThree = levelOne.children[i]
									resp = (await sequelize.query(
										`insert into pos_level_three_chart_of_accounts(pos_level_two_chart_of_account_id,name,name_en,code) values('${levelTwo.id}','${utils.escape_str(levelThree.name.toString().trim())}','${utils.escape_str(levelThree.name_en.toString().trim())}','${utils.escape_str(levelThree.code.toString().trim())}')`,
									))[0]
									leveThree.server_id = resp[0]
									console.log("level three inserted",leveTwo)
								}
							}
						}
					}
				}

			}
		}
		resolve(chart_of_accounts)
	})
}
utils.getPOSChartOfAccounts = pos_station_id =>{
	return new Promise(async resolve => {
		resolve((await sequelize.query(`
          SELECT
    json_arrayagg(
        json_object(
            'id',id,
            'client_id',client_id,
            'level',0,
            'is_editable',0,
            'name',name,
            'type',type,
            'name_en',name_en,
            'code',code,
            'children',
            (
                SELECT
                    json_arrayagg(
                        json_object(
                            'id',id,
							'client_id',client_id,
                            'level',1,
                            'is_editable',is_editable,
                            'name',name,
                            'name_en',name_en,
                            'code',code,
                            'children',
                            (
                                SELECT
                                    json_arrayagg(
                                        json_object(
                                            'id',id,
											'client_id',client_id,
                                            'level',2,
                                            'is_editable',is_editable,
                                            'name',name,
                                            'name_en',name_en,
                                            'code',code,
                                            'children',
                                            (
                                                SELECT
                                                    json_arrayagg(
                                                        json_object(
                                                            'id',id,
															'client_id',client_id,
                                                            'level',3,
                                                            'is_editable',is_editable,
                                                            'name',name,
                                                            'name_en',name_en,
                                                            'code',code
                                                        )
                                                    )
                                                from
                                                    pos_level_three_chart_of_accounts
                                                where
                                                    pos_level_two_chart_of_account_id = pos_level_two_chart_of_accounts.id
                                            )
                                        )
                                    )
                                from
                                  pos_level_two_chart_of_accounts
                                where
                                    pos_level_one_chart_of_account_id = pos_level_one_chart_of_accounts.id
                            )
                        )
                    )
                from
                  pos_level_one_chart_of_accounts
                where
                    pos_station_id=${pos_station_id}
                    and pos_main_chart_of_accounts_type_id = pos_main_chart_of_accounts_types.id
            )
        )
    ) as data
from
    pos_main_chart_of_accounts_types;
      `))[0][0].data)
	})

}
utils.getDefaultPOSChartOfAccounts = (user_data)=>{
	return new Promise(async resolve=>{
		resolve((await sequelize.query(`
              SELECT json_arrayagg(
                         json_object(
                             'id', id,
                             'level', 0,
                             'is_editable', 0,
                             'name', name,
                             'type', type,
                             'name_en', name_en,
                             'code', code,
                             'children',
                             (SELECT json_arrayagg(
                                         json_object(
                                             'id', id,
                                             'level', 1,
                                             'is_editable', is_editable,
                                             'name', name,
                                             'name_en', name_en,
                                             'code', code,
                                             'children',
                                             (SELECT json_arrayagg(
                                                         json_object(
                                                             'id', id,
                                                             'level', 2,
                                                             'is_editable', is_editable,
                                                             'name', name,
                                                             'name_en', name_en,
                                                             'code', code,
                                                             'children',
                                                             (SELECT json_arrayagg(
                                                                         json_object(
                                                                             'id', id,
                                                                             'level', 3,
                                                                             'is_editable', is_editable,
                                                                             'name', name,
                                                                             'name_en', name_en,
                                                                             'code', code
                                                                           )
                                                                       )
                                                              from default_pos_level_three_chart_of_accounts
                                                              where default_pos_level_two_chart_of_account_id =
                                                                    default_pos_level_two_chart_of_accounts.id)
                                                           )
                                                       )
                                              from default_pos_level_two_chart_of_accounts
                                              where default_pos_level_one_chart_of_account_id =
                                                    default_pos_level_one_chart_of_accounts.id)
                                           )
                                       )
                              from default_pos_level_one_chart_of_accounts
                              where pos_type_id = ${user_data.pos_station.pos_type_id}
                                and pos_main_chart_of_accounts_type_id = pos_main_chart_of_accounts_types.id)
                           )
                       ) as data
              from pos_main_chart_of_accounts_types;
            `))[0][0].data)
	})
}
utils.getDefaultPOSSubledgers = (user_data)=>{
	return new Promise(async resolve=>{
		resolve((await sequelize.query(`select *,
                                                                (select json_arrayagg(json_object("id", id,
                                                                                                  "default_pos_level_two_chart_of_account_id",
                                                                                                  default_pos_level_two_chart_of_account_id,
                                                                                                  "name", name,
                                                                                                  "name_en", name_en))
                                                                 from default_pos_subledger_parent_accounts
                                                                 where default_pos_subledger_id = pos_subledger.id
                                                                   and pos_type_id = ${user_data.pos_station.pos_type_id})
                                                                  as subledger_parent_accounts,
                                                                (select json_arrayagg(json_object("id", id, "name",
                                                                                                  name, "name_en",
                                                                                                  name_en, "has_sub",
                                                                                                  has_sub, "type", type,
                                                                                                  "subledger_subaccounts",
                                                                                                  (select json_arrayagg(json_object(
                                                                                                      "id", id,
                                                                                                      "name",name, 
                                                                                                      "name_en",name_en,
                                                                                                      "default_pos_level_three_chart_of_account_id",
                                                                                                      default_pos_level_three_chart_of_account_id))
                                                                                                   from default_pos_subledger_account_subaccounts
                                                                                                   where default_pos_subledger_account_id = pos_subledger_accounts.id
                                                                                                     and pos_type_id = ${user_data.pos_station.pos_type_id})))
                                                                 from pos_subledger_accounts
                                                                 where pos_subledger_id = pos_subledger.id)
                                                                  as subledger_accounts
                                                         from pos_subledger`))[0])
	})
}
utils.createPOSSubledgers = (default_subledgers,pos_station_id,l2_accounts,l3_accounts)=>{
	return new Promise(resolve => {
		let promises = default_subledgers.map(subledger=>{
			return new Promise(async resolve => {
				let first_finished = false
				// parent_Accounts
				if(subledger.subledger_parent_accounts) {
					let parent_accounts_promises = subledger.subledger_parent_accounts.map(parent_account => {
						return new Promise(async resolve => {
							resolve(await conn.pos_subledger_parent_accounts.create({
									pos_station_id,
									pos_subledger_id: subledger.id,
									name: parent_account.name,
									name_en: parent_account.name_en,
									type: parent_account.type,
									pos_level_two_chart_of_account_id: l2_accounts.find(account =>
										account.id == parent_account.default_pos_level_two_chart_of_account_id
									)?.server_id
								}
							))
						})
					})
					Promise.all(parent_accounts_promises).then((data) => {
						subledger.subledger_parent_accounts = data
						if (!first_finished) {
							first_finished = true
						} else {
							resolve()
						}
					})
				}
				else{
					if (!first_finished) {
						first_finished = true
					} else {
						resolve()
					}
				}

				// subacounts
				if(subledger.subledger_accounts) {
					let accounts_promises = subledger.subledger_accounts.map(account => {
						return new Promise(async resolve => {
							if(account.subledger_subaccounts) {
								let subaccounts_promises = account.subledger_subaccounts.map(subaccount => {
									return new Promise(async resolve => {
										resolve(await conn.pos_subledger_account_subaccounts.create({
												pos_station_id,
												pos_subledger_account_id: account.id,
												name: subaccount.name,
												name_en: subaccount.name_en,
												pos_level_three_chart_of_account_id: l3_accounts.find(account =>
													account.id == subaccount.default_pos_level_three_chart_of_account_id
												)?.server_id
											}
										))
									})

								})
								Promise.all(subaccounts_promises).then(data => {
									account.subledger_subaccounts = data
									resolve()
								})
							}
							else
								resolve()
						})
					})
					Promise.all(accounts_promises).then(() => {
						if (!first_finished) {
							first_finished = true
						} else {
							resolve()
						}
					})
				}
				else{
					if (!first_finished) {
						first_finished = true
					} else {
						resolve()
					}
				}
			})
		})
		Promise.all(promises).then(()=>{
			console.log("ALL subledgers has been created",JSON.stringify(default_subledgers,null,2))
			resolve(default_subledgers)
		})
	})
}
utils.getPOSSubledgers = pos_station_id => {
	return new Promise(async resolve => {
		resolve((await sequelize.query(`select
											*,
											(select
												 json_arrayagg(json_object("id",id,"pos_level_two_chart_of_account_id",pos_level_two_chart_of_account_id,"name",name,"name_en",name_en))
											 from pos_subledger_parent_accounts
											 where pos_subledger_id=pos_subledger.id and pos_station_id=${pos_station_id})
												as subledger_parent_accounts,
											(select
												 json_arrayagg(json_object("id",id,"name",name,"name_en",name_en,"has_sub",has_sub,"type",type,"subledger_subaccounts",(
													 select
														 json_arrayagg(json_object("id",id,"name",name,"name_en",name_en,"pos_level_three_chart_of_account_id",pos_level_three_chart_of_account_id))
													 from pos_subledger_account_subaccounts
													 where pos_subledger_account_id=pos_subledger_accounts.id and pos_station_id=${pos_station_id}
												 )))
											 from pos_subledger_accounts where pos_subledger_id=pos_subledger.id)
												as subledger_accounts
										from pos_subledger`))[0])
	})
}
module.exports = utils
