const { conn, sequelize } = require("../../db/conn");
const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const {
  getDeletedData,
  getAddedData,
} = require("../../utils/filterData/index");

exports.createUsers = async (req, res, next) => {
  console.log("register", req.body);
  var isInserted;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.pass, salt, async (err, hash) => {
      console.log(hash);
      var data = {
        // "user": req.body.user,
        pass: hash,
        name: req.body.name,
        email: req.body.email,
        tel: req.body.tel,
        user_type_id: 1,
      };

      console.log();

      isInserted = await conn.users.create(data);

      delete isInserted.pass;

      const SECRET = "alkdfhjakfhkjna2h23687673yydjhfljadgf3t7y";

      const token = jwt.sign(
        {
          isInserted,
        },
        SECRET
      );
      console.log("token *****", token);


      await conn.user_roles.create({
        user_id: isInserted.id,
        role_id: 5 /* 5 is pos_hub_manager */,
      });

      res.status(200).json({ status: true, data: { isInserted, token } });

    });
  });
};

//@decs   Get All
//@route  post
//@access Public
exports.updateUserPass = async (req, res) => {
  try {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.pass, salt, async (err, hash) => {
        const updated_user = await conn.users.update(
          { pass: hash },
          { where: { id: req.body.user_id } }
        );
        console.log({ updated_user });
        res.status(201).json({ status: true });
      });
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى ${error}`,
    });
  }
};
exports.createAdminUser = async (req, res, next) => {
  console.log("register", req.body);
  const transaction = await sequelize.transaction();
  var isInserted;
  try {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.pass, salt, async (err, hash) => {
        console.log(hash);
        var data = {
          pass: hash,
          name: req.body.name,
          email: req.body.email,
          user_type_id: 2,
        };

        console.log();

        const create_user = await conn.users.create(data, { transaction });

        const user_role_data = req.body.roles
          .filter((e) => e.permission == true)
          .map((e) => ({ user_id: create_user.id, role_id: e.id }));
        console.log(user_role_data);
        const create_user_roles = await conn.user_roles.bulkCreate(
          user_role_data,
          { transaction }
        );

        transaction.commit();

        res.status(200).json({
          status: true,
          data: { user_role: create_user_roles, user: create_user },
        });
      });
    });
  } catch (error) {
    transaction.rollback();

    res.status(200).json({
      status: false,
      msg: "مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى",
    });
  }
};
exports.createPosManager = async (req, res, next) => {
  console.log("register", req.body);
  const transaction = await sequelize.transaction();
  var isInserted;
  try {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.pass, salt, async (err, hash) => {
        console.log(hash);
        var data = {
          pass: hash,
          name: req.body.name,
          email: req.body.email,
          tel: req.body.tel,
          user_type_id: 1,
        };

        console.log();

        const create_user = await conn.users.create(data, { transaction });

        const create_user_roles = await conn.user_roles.bulkCreate(
          { ser_id: create_user.id, role_id: 5 },
          { transaction }
        );

        transaction.commit();

        res.status(200).json({
          status: true,
          data: { user_role: create_user_roles, user: create_user },
        });
      });
    });
  } catch (error) {
    transaction.rollback();

    res.status(200).json({
      status: false,
      msg: "مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى",
    });
  }
};
exports.login = async (req, res) => {
  var user = await conn.users.findOne({
    include: ["user_type"],
    where: { email: req.body.email },
  });
  console.log(req.body);
  console.log(" the logd user is  ", user);
  const SECRET = "alkdfhjakfhkjna2h23687673yydjhfljadgf3t7y";
  if (user) {
    console.log("valied user");
    bcrypt.compare(req.body.pass, user.pass, async function (err, resp) {
      console.log("the resp ", resp);
      console.log("the pass from table ", user.pass);
      console.log("the request password is ", req.body.pass);
      if (resp) {
        delete user.pass;
        const user_data = {
          id: user.id,
          name: user.name,
          email: user.email,
          user_type: user.user_type,
          // roles: user.
        };
        const token = jwt.sign(
          {
            user_data,
          },
          SECRET
        );
        console.log("token *****", token);

        console.log("the user data is *********", user_data);
        res.send({ status: true, data: { token } });
      } else {
        res.send({
          status: 0,
          msg: "Wrong Username or Password Please Login Again",
        });
      }
    });
  } else res.send({ status: 0, msg: "Wrong Username or Password" });
};

exports.adminLogin = async (req, res) => {
  try {
    var user = await conn.users.findOne({
      where: { email: req.body.email },
      include: [
        {
          model: conn.user_roles,
          as: "user_roles",
          include: {
            model: conn.roles,
            as: "role",
          },
        },
        {
          model: conn.user_types,
          as: "user_type",
        }
      ],
    });
    console.log(req.body);
    console.log(" the logged user is  ", JSON.stringify(user, null, 2));
    const SECRET = "alkdfhjakfhkjna2h23687673yydjhfljadgf3t7y";
    if (user) {
      console.log("valied user");
      console.log("user :", user);
      bcrypt.compare(req.body.pass, user.pass, async function (err, resp) {
        console.log("the resp ", resp);
        console.log("the pass from table ", user.pass);
        console.log("the request password is ", req.body.pass);

        console.log(
          "step 200",
          user.user_roles.map((e) => e.role.code)
        );

        const types = user.user_type.name;

        if (resp && types == "admin") {
          delete user.pass;
          const user_data = {
            id: user.id,
            name: user.name,
            email: user.email,
            tel: user.tel,
            roles: user.user_roles,
            user_type: user.user_type,
          };
          const token = jwt.sign(
            {
              user_data,
            },
            SECRET
          );
          console.log("token *****", token);

          console.log("the user data is *********", user_data);
          res.send({ status: true, data: { token } });
        } else {
          res.send({
            status: 0,
            msg: "Wrong Username or Password Please Login Again",
          });
        }
      });
    } else res.send({ status: 0, msg: "Wrong Username or Password" });
  } catch (error) {
    console.log("272",error)
    res.send({
      status: false,
      msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى`,
    });
  }
};

exports.posHubLogin = async (req, res) => {
  try {
    var user = await conn.users.findOne({
      where: { email: req.body.email },
      include: [
        {
          model: conn.user_roles,
          as: "user_roles",
          include: {
            model: conn.roles,
            as: "role",
          },
        },
        {
          model: conn.user_types,
          as: "user_type",
        },
        {
          model: conn.pos_hubs,
          as: "pos_hub_admin_pos_hubs",
          include: [
            { model: conn.pos_types, as: "pos_type" },
            {
              model: conn.pos_revenue_categorization,
              as: "pos_revenue_categorization",
            },
          ],
        },
      ],
    });
    console.log(req.body);
    console.log(" the logged user is  ", JSON.stringify(user, null, 2));
    const SECRET = "alkdfhjakfhkjna2h23687673yydjhfljadgf3t7y";
    if (user) {
      console.log("valied user");
      console.log("user :", user);
      bcrypt.compare(req.body.pass, user.pass, async function (err, resp) {
        console.log("the resp ", resp);
        console.log("the pass from table ", user.pass);
        console.log("the request password is ", req.body.pass);

        console.log(
          "step 200",
          user.user_roles.map((e) => e.role.code)
        );

        const types = user.user_type.name;

        if (resp && types == "pos_hub_manager") {
          delete user.pass;
          let user_data = {
            id: user.id,
            name: user.name,
            email: user.email,
            tel: user.tel,
            roles: user.user_roles,
            user_type: user.user_type,
            pos_hub: user.pos_hub_admin_pos_hubs[0],
          };
          console.log("user :", JSON.stringify(user, null, 2));

          const token = jwt.sign(
            {
              user_data,
            },
            SECRET
          );
          console.log("token *****", token);
          console.log("the user data is *********", user_data);
          res.send({ status: true, data: { token } });
        } else if (resp && types == "pos_hub_admin") {
          delete user.pass;
          let user_data = {
            id: user.id,
            name: user.name,
            email: user.email,
            tel: user.tel,
            roles: user.user_roles,
            user_type: user.user_type,
            pos_hub: user.pos_hub_admin_pos_hubs[0],
          };

          if (
            user.pos_hub_admin_pos_hubs[0].centeric_products &&
            user.pos_hub_admin_pos_hubs[0].single_products_list
          ) {
            let category = await conn.pos_categories.findOne({
              where: {
                pos_hub_id: user.pos_hub_admin_pos_hubs[0].id,
              },
            });

            user_data.category_id = category.id;
          }

          const checkPosHubSubscriptionQuery =
            await sequelize.query(`SELECT  if(subscription_end_date > CURRENT_TIMESTAMP, 1,0) is_active  FROM pos_hub_subscriptions  WHERE pos_hub_id= ${user.pos_hub_admin_pos_hubs[0].id}
            ORDER BY id DESC limit 1`);

          console.log(
            "checkPosHubSubscriptionQuery",
            checkPosHubSubscriptionQuery[0][0].is_active
          );
          if (checkPosHubSubscriptionQuery[0][0].is_active) {
            const token = jwt.sign(
              {
                user_data,
              },
              SECRET
            );
            console.log("token *****", token);
            console.log("the user data is *********", user_data);
            res.send({ status: true, data: { token } });
          } else {
            res.send({
              status: 0,
              msg: loadLocaleMessages(req.body.lang).users
                .exceptions.subscription_failed,
            });
          }
        } else {
          res.send({
            status: 0,
            msg: "Wrong Username or Password Please Login Again",
          });
        }
      });
    } else res.send({ status: 0, msg: "Wrong Username or Password" });
  } catch (error) {
    console.log(error);
    res.send({
      status: false,
      msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى`,
    });
  }
};

exports.marketingTeamMemberLogin = async (req, res) => {
  try {
    const SECRET = "alkdfhjakfhkjna2h23687673yydjhfljadgf3t7y";
    const user = await conn.marketing_team_members.findOne({
      where: { email: req.body.email },
    });
    if (user) {
      console.log("valied member");
      bcrypt.compare(req.body.pass, user.password, async function (err, resp) {
        if (resp) {
          let returnedUser = {
            id: user.id,
            tel: user.tel,
            name: user.name,
            email: user.email,
          };

          // const token = await start_session(user.id, req);
          // console.log("token *****", token);


          returnedUser.roles = [
            {
              role: {
                id: 99999999,
                code: "marketing_team_member",
                name: "عضو فريق التسويق",
                name_en: "Marketing Team Member",
              },
            },
          ];

          // companies.forEach((company) => {
          //   const permissionsForCompany = {};
          //   roles.forEach((role) => {
          //     permissionsForCompany[role.code] = false;
          //   });
          //   userRoles.forEach((userRole) => {
          //     if (userRole.company_id === company.id) {
          //       const role = roles.find((role) => role.id === userrole.code_id);
          //       permissionsForCompany[role.code] = true;
          //     }
          //   });
          //   permissions[company.name] = permissionsForCompany;
          // });
          returnedUser.isTeamMember = true;

          const token = jwt.sign(
            {
              user_data: returnedUser,
            },
            SECRET
          );

          res.send({
            status: true,
            data: {
              token,
            },
          });
        } else {
          res.send({ status: false, msg: "Wrong Username or Password" });
        }
      });
    } else res.send({ status: false, msg: "Wrong Username or Password" });
  } catch (error) {
    console.log({ error });
    res.send({
      status: false,
      msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى: ${error}`,
    });
  }
};

exports.forgetPasswordEmail = async (req, res) => {
  const email = req.body.email;
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const user_data = {
    reset_token: code,
    session_time: Date.now(),
  };
  try {
    const user = await conn.users.findOne({
      where: {
        email,
      },
    });
    if (user) {
      const update_user = await conn.users.update(user_data, {
        where: {
          email,
        },
      });
      console.log(update_user);
      let transporter = nodemailer.createTransport({
        host: "mail.elinnma.com",
        port: 465,
        secure: true, // upgrade later with STARTTLS
        auth: {
          user: "omar554@elinnma.com",
          pass: "1I=G(+,c03S,",
        },
      });
      var message = {
        from: "omar554@elinnma.com",
        to: email,
        subject: "Password Reset",
        text: `Hello mr.${user.name} your verfiy code is ${code}`,
      };

      console.log(message);
      transporter.sendMail(message, function (err) {
        if (err) {
          // check if htmlstream is still open and close it to clean up
          console.log(err);
        } else {
          res.status(200).json({ status: true, data: "send" });
        }
      });
    } else {
      res.status(200).json({ status: false, data: "email not found" });
    }
  } catch (error) {
    res.status(200).json({ status: false, data: "error" });
  }
};

exports.forgetPasswordVerfiyCode = async (req, res) => {
  const email = req.body.email;
  const code = req.body.code;
  try {
    const user = await conn.users.findOne({
      where: {
        email,
      },
    });
    if (user) {
      const check_code = await sequelize.query(
        `select abs(time_to_sec(timediff((select session_time from users where email = '${email}'), CURRENT_TIMESTAMP )) / 3600)<2 as state`
      );

      if (check_code.state) {
        if (user.reset_token == code) {
          res.send({ status: true, data: "send" });

          return;
        } else {
          res.send({ status: false, data: "Wrong code" });
          return;
        }
      } else {
        res.send({ status: false, data: "Code expired" });
        return;
      }
    } else {
      res.send({ status: false, data: "email not found" });
      return;
    }
  } catch (error) {
    res.send({ status: false, data: "error" });
  }
};

exports.forgetPasswordSetNewPass = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await conn.users.findOne({
      where: {
        email,
      },
    });
    if (user) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.pass, salt, async (err, hash) => {
          console.log(hash);
          var data = {
            pass: hash,
          };

          isUpdated = await conn.users.update(data, {
            where: {
              email,
            },
          });

          res
            .status(200)
            .json({ status: true, data: "User Password reset successfully" });
        });
      });
    } else {
      res.send({ status: false, data: "email not found" });
      return;
    }
  } catch (error) {
    res.send({ status: false, data: "error" });
  }
};

exports.selectUsersByFilter = async (req, res, next) => {
  var params = {
    limit: 10,
    page: 1,
    constrains: { name: "" },
    relations: [{ model: conn.browsers }, { model: conn.hr_departments }],
  };
  const result = await filter.filter("users", params);
  if (result) {
    res.status(200).json({ status: true, data: result });
  } else {
    res.status(200).json({ status: false, msg: "No data founded" });
  }
};
exports.chartData = async (req, res, next) => {
  try {
    let regMonth = [];
    var tab = req.body.tab;
    let type = req.body.type;
    const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7));
    if (type == 1) {
      //day
      sequelize
        .query(
          `select DATE_FORMAT(selected_date,"%Y-%m-%d") label,(SELECT COUNT(*) FROM ${tab} WHERE  date(${tab}.createdAt) =selected_date GROUP BY DATE_FORMAT(${tab}.createdAt,"%Y-%m-%d")) y from (select selected_date from (select adddate('1970-01-01',t4*10000 + t3*1000 + t2*100 + t1*10 + t0) selected_date from (select 0 t0 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0, (select 0 t1 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1, (select 0 t2 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2, (select 0 t3 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3, (select 0 t4 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v where selected_date between date(date_sub(now(),INTERVAL 1 month)) and CURRENT_DATE()) tmp;
      `
        )
        .then(function (response) {
          res.status(200).json({ status: true, data: response[0] });
        })
        .error(function (err) {
          // res.json(err);
        });
    }
    if (type == 2) {
      //month
      sequelize
        .query(
          `select v label,(SELECT COUNT(*) FROM ${tab} WHERE  DATE_FORMAT(${tab}.createdAt,"%Y-%m") =v GROUP BY DATE_FORMAT(${tab}.createdAt,"%Y-%m")) y  from(select DISTINCT DATE_FORMAT(selected_date,"%Y-%m") v from (select adddate('1970-01-01',t4*10000 + t3*1000 + t2*100 + t1*10 + t0) selected_date from (select 0 t0 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0, (select 0 t1 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1, (select 0 t2 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2, (select 0 t3 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3, (select 0 t4 union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v where DATE_FORMAT(selected_date,"%Y-%m") between DATE_FORMAT((date_sub(now(),interval 1 year)),"%Y-%m") and DATE_FORMAT(now(),"%Y-%m")) tmp2;
        `
        )
        .then(function (response) {
          res.status(200).json({ status: true, data: response[0] });
        })
        .error(function (err) {
          res.json(err);
        });
    }
  } catch (error) {
    console.log(error);
  }
};

//@decs   Get All
//@route  GET
//@access Public
exports.getUsers = async (req, res, next) => {
  try {
    const result = await conn.users.findAll({
      include: [
        {
          model: conn.user_roles,
          as: "user_roles",
          include: [{ model: conn.roles, as: "role" }],
        },
      ],
    });
    if (result.length != 0)
      res.status(200).json({ status: true, data: result });
    else {
      res.status(200).json({ status: false, msg: `No data founded` });
    }
  } catch (e) {
    res.status(200).json({
      status: false,
      msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى`,
    });
  }
};

exports.updateUsersWithRoles = async (req, res, next) => {
  console.log("****************** update user called *************");
  try {
    let checkedRole, uncheckedRole;
    async function edit(role) {
      checkedRole = role.filter((role) => role.permission);
      uncheckedRole = role.filter((role) => !role.permission);
      console.log("checkedRole :", checkedRole);
      console.log("uncheckedRole :", uncheckedRole);

      checkedRole.forEach(async (r) => {
        var count = await conn.user_roles.count({
          where: {
            user_id: req.body.user_id,
            role_id: r.id,
          },
        });

        if (!count) {
          await conn.user_roles.create({
            user_id: req.body.user_id,
            role_id: r.id,
          });
        }
      });

      uncheckedRole.forEach(async (r) => {
        var count = await conn.user_roles.count({
          where: {
            user_id: req.body.user_id,
            role_id: r.id,
          },
        });

        if (count) {
          await conn.user_roles.destroy({
            where: {
              user_id: req.body.user_id,
              role_id: r.id,
            },
          });
        }
      });
    }

    await conn.users.update(req.body, {
      where: { id: req.body.user_id },
    });
    await edit(req.body.user_roles);

    res.status(200).json({ status: true, data: req.body });
  } catch (e) {
    console.log(`مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى`);
    res.status(500).json({
      status: false,
      msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى`,
    });
  }
};
exports.UpdatePosManager = async (req, res, next) => {
  console.log("****************** update user called *************");
  try {
    await conn.users.update(req.body, {
      where: { id: req.body.user_id },
    });

    res.status(200).json({ status: true, data: req.body });
  } catch (e) {
    console.log(`مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى`);
    res.status(500).json({
      status: false,
      msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى`,
    });
  }
};

// exports.createUsers =async (req, res, next) => {
//     try{
//       const result=await conn.users.create(req.body)
//        if(result.length!=0)
//          res.status(200).json({ status: true, data: result })
//          else{
//            res.status(200).json({ status: false, msg: `No data founded` })
//          }
//       }
//     catch (e) {
//              res.status(200).json({ status: false, msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى` })
//      }

// }

exports.paginate = async (req, res, next) => {
  try {
    var offset = (req.body.page - 1) * req.body.limit;
    let results, count;
    console.log("the offset", offset, "the limit is ", req.body.limit);

    if (req.body.type == "pos_hub_manager") {
      results = await conn.users.findAll({
        attributes: [
          "id",
          "name",
          "email",
          "tel",
          "created",
          "updated",
          "active",
          "user_type_id",
        ],
        include: [
          {
            model: conn.user_roles,
            as: "user_roles",
            include: [{ model: conn.roles, as: "role" }],
          },
        ],
        where: {
          // which is 'pos_hub_manager' in user_types table
          user_type_id: 1,
        },
        order: [["id", "DESC"]],

        offset: offset,
        limit: req.body.limit,
        subQuery: true,
      });
      // sequelize for some reason didnt output the correct count

      count = await conn.users.count({
        where: {
          // which is 'pos_hub_manager' in user_types table
          user_type_id: 1,
        },
      });
    } else if (req.body.type == "admin") {
      results = await conn.users.findAll({
        attributes: [
          "id",
          "name",
          "email",
          "tel",
          "created",
          "updated",
          "active",
          "user_type_id",
        ],
        include: [
          {
            model: conn.user_roles,
            as: "user_roles",
            include: [{ model: conn.roles, as: "role" }],
          },
        ],
        where: {
          // which is 'admin' in user_types table
          user_type_id: 2,
        },
        order: [["id", "DESC"]],

        offset: offset,
        limit: req.body.limit,
        subQuery: true,
      });
      // sequelize for some reason didnt output the correct count

      count = await conn.users.count({
        where: {
          // which is 'pos_hub_manager' in user_types table
          user_type_id: 2,
        },
      });
    } else {
      results = await conn.users.findAll({
        order: [["id", "DESC"]],
        include: [
          {
            model: conn.user_roles,
            as: "user_roles",
            include: [{ model: conn.roles, as: "role" }],
          },
        ],
        offset: offset,
        limit: req.body.limit,
        subQuery: false,
      });
      count = await conn.users.count();
    }
    console.log("the len is", count);
    if (results) {
      res.status(200).json({ status: true, data: results, tot: count });
    } else {
      res.status(200).json({ status: false, msg: `No data founded` });
    }
  } catch (e) {
    console.log(e);
    res.status(200).json({
      status: false,
      msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى`,
      e,
    });
  }
};

exports.search = async (req, res, next) => {
  var searchCol = req.body.col;
  var offset = (req.body.page - 1) * req.body.limit;
  var search = req.body.search;

  if (req.body.type == "pos_hub_manager") {
    await conn.users
      .findAll({
        limit: req.body.limit,
        offset: offset,
        attributes: [
          "id",
          "name",
          "email",
          "tel",
          "created",
          "updated",
          "active",
          "user_type_id",
        ],

        include: [
          {
            model: conn.user_roles,
            as: "user_roles",
            include: [{ model: conn.roles, as: "role" }],
          },
        ],
        where: {
          [searchCol]: {
            [Op.like]: "%" + search + "%",
          },
          user_type_id: 1,
        },
      })
      .then(async function (assets) {
        var count = conn.users.count({
          where: {
            [searchCol]: {
              [Op.like]: "%" + search + "%",
            },
            user_type_id: 1,
          },
        });
        res.status(200).json({ status: true, data: assets, tot: count });
      })
      .catch(function (error) {
        console.log(error);
      });
  } else if (req.body.type == "admin") {
    await conn.users
      .findAll({
        limit: req.body.limit,
        offset: offset,
        attributes: [
          "id",
          "name",
          "email",
          "tel",
          "created",
          "updated",
          "active",
          "user_type_id",
        ],

        include: [
          {
            model: conn.user_roles,
            as: "user_roles",
            include: [{ model: conn.roles, as: "role" }],
          },
        ],
        where: {
          [searchCol]: {
            [Op.like]: "%" + search + "%",
          },
          user_type_id: 2,
        },
      })
      .then(async function (assets) {
        var count = conn.users.count({
          where: {
            [searchCol]: {
              [Op.like]: "%" + search + "%",
            },
            user_type_id: 2,
          },
        });
        res.status(200).json({ status: true, data: assets, tot: count });
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    await conn.users
      .findAll({
        limit: req.body.limit,
        offset: offset,
        attributes: [
          "id",
          "name",
          "email",
          "tel",

          "created",
          "updated",
          "active",
          "user_type_id",
        ],

        include: [
          {
            model: conn.user_roles,
            as: "user_roles",
            include: [{ model: conn.roles, as: "role" }],
          },
        ],
        where: {
          [searchCol]: {
            [Op.like]: "%" + search + "%",
          },
        },
      })
      .then(async function (assets) {
        var count = conn.users.count({
          where: {
            [searchCol]: {
              [Op.like]: "%" + search + "%",
            },
          },
        });
        res.status(200).json({ status: true, data: assets, tot: count });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
};
//@decs   Get All
//@route  GET
//@access Public
exports.getUsersById = async (req, res, next) => {
  try {
    const result = await conn.users.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'name', 'tel', 'email']
    });
    if (result.length != 0)
      res.status(200).json({ status: true, data: result });
    else {
      res.status(200).json({ status: false, msg: `No data founded` });
    }
  } catch (e) {
    res.status(200).json({
      status: false,
      msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى`,
    });
  }
};

//@decs   Get All
//@route  Put
//@access Public
exports.updateUsers = async (req, res, next) => {
  try {
    let checkedRole, uncheckedRole;
    async function edit(role) {
      checkedRole = role.filter((role) => role.permission);
      uncheckedRole = role.filter((role) => !role.permission);
      console.log("checkedRole :", checkedRole);
      console.log("uncheckedRole :", uncheckedRole);

      checkedRole.forEach(async (r) => {
        var count = await conn.user_roles.count({
          where: {
            user_id: req.params.id,
            role_id: r.id,
          },
        });

        if (!count) {
          await conn.user_roles.create({
            user_id: req.params.id,
            role_id: r.id,
          });
        }
      });

      uncheckedRole.forEach(async (r) => {
        var count = await conn.user_roles.count({
          where: {
            user_id: req.params.id,
            role_id: r.id,
          },
        });

        if (count) {
          await conn.user_roles.destroy({
            where: {
              user_id: req.params.id,
              role_id: r.id,
            },
          });
        }
      });
    }

    const isUpdated = await conn.users.update(req.body, {
      where: { id: req.params.id },
    });
    if (isUpdated) {
      res.status(200).json({ status: true, data: req.body });
    } else {
      res.status(200).json({ status: true, msg: "filed to update data" });
    }
  } catch (e) {
    console.log(e);
    res.status(200).json({
      status: false,
      msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى`,
    });
  }
};

//@decs   Get All
//@route  Delete
//@access Public
exports.deleteUsers = async (req, res, next) => {
  try {
    const isDeleted = await conn.users.destroy({
      where: { id: req.params.id },
    });
    if (isDeleted)
      res.status(200).json({ status: true, msg: `data deleted successfully` });
    else {
      res.status(200).json({ status: false, msg: `filed to delete data` });
    }
  } catch (e) {
    res.status(200).json({
      status: false,
      msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى`,
    });
  }
};

exports.getSubscriptions = async (req, res, next) => {
  const { type, page, limit, lang, user_id } = req.query;
  try {
    const offset = (page - 1) * limit;
    let query, queryResult, countQuery, countResult;

    if (type == "pos_hubs") {
      query = `
      
  SELECT
      phs.id,
      phs.pos_hub_id,
      ph.name pos_hub_name,
      phs.type,
      phs.period,
      phs.pos_hub_packge_id,
      php.name,
      php.name_en,
      phs.total_price,
      phs.upgrade_from_pos_hub_subscription_id,
      phs.subscription_start_date,
      phs.subscription_end_date,
      if(subscription_end_date > CURRENT_TIMESTAMP, 1, 0) is_active,
      phs.created
  from
      pos_hub_subscriptions phs
      LEFT JOIN pos_hubs ph on ph.id = phs.pos_hub_id
      LEFT JOIN pos_hub_packages php on php.id = phs.pos_hub_packge_id
  WHERE
      pos_hub_manager_id = ${user_id}
  ORDER by
      phs.created DESC
      
      LIMIT ${limit} OFFSET ${offset}
  
      `;

      countQuery = `
      SELECT
          count(phs.id) count
      from
          pos_hub_subscriptions phs
          LEFT JOIN pos_hubs ph on ph.id = phs.pos_hub_id
      where
          pos_hub_manager_id = ${user_id}
      `;
    } else if (type == "pos_stations") {
      query = `
      
        SELECT
            psub.id,
            psub.pos_station_id,
            ps.name pos_station_name,
            psub.type,
            psub.period,
            psub.subscription_packge_id,
            sp.name,
            sp.name_en,
            psub.total_price,
            psub.upgrade_from_pos_subscription_id,
            psub.subscription_start_date,
            psub.subscription_end_date,
            if(subscription_end_date > CURRENT_TIMESTAMP, 1, 0) is_active,
            psub.created
        from
            pos_subscriptions psub
            LEFT JOIN pos_stations ps on ps.id = psub.pos_station_id
            LEFT JOIN subscription_packages sp on sp.id = psub.subscription_packge_id
        WHERE
            pos_hub_manager_id = ${user_id}
        ORDER by
            psub.created DESC
        LIMIT
            ${limit} OFFSET ${offset}
      
      `;

      countQuery = `
      SELECT
          count(psub.id) count
      from
          pos_subscriptions psub
          LEFT JOIN pos_stations ps on ps.id = psub.pos_station_id
      where
          pos_hub_manager_id = ${user_id}
      `;
    }

    queryResult = await sequelize.query(query);

    countResult = await sequelize.query(countQuery);

    if (queryResult[0].length != 0)
      res.status(200).json({
        status: true,
        data: queryResult[0],
        tot: countResult[0][0].count,
      });
    else {
      res.status(200).json({
        status: true,
        data: [],
        msg: loadLocaleMessages(lang).pos_products.exceptions
          .not_found,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(200).json({
      status: false,
      msg: loadLocaleMessages(lang).pos_products.exceptions
        .msg_error,
    });
  }
};
exports.searchSubscriptions = async (req, res, next) => {
  const { type, page, limit, lang, user_id, search } = req.query;
  try {
    const offset = (page - 1) * limit;
    let query, queryResult, countQuery, countResult;

    if (type == "pos_hubs") {
      query = `
      
  SELECT
      phs.id,
      phs.pos_hub_id,
      ph.name pos_hub_name,
      phs.type,
      phs.period,
      phs.pos_hub_packge_id,
      php.name,
      php.name_en,
      phs.total_price,
      phs.upgrade_from_pos_hub_subscription_id,
      phs.subscription_start_date,
      phs.subscription_end_date,
      if(subscription_end_date > CURRENT_TIMESTAMP, 1, 0) is_active,
      phs.created
  from
      pos_hub_subscriptions phs
      LEFT JOIN pos_hubs ph on ph.id = phs.pos_hub_id
      LEFT JOIN pos_hub_packages php on php.id = phs.pos_hub_packge_id
  WHERE
      pos_hub_manager_id = ${user_id}
      and ph.name like "%${search}%"
  ORDER by
      phs.created DESC
      
      LIMIT ${limit} OFFSET ${offset}
  
      `;

      countQuery = `
      SELECT
          count(phs.id) count
      from
          pos_hub_subscriptions phs
          LEFT JOIN pos_hubs ph on ph.id = phs.pos_hub_id
      where
          pos_hub_manager_id = ${user_id}
          and ph.name like "%${search}%"
      `;
    } else if (type == "pos_stations") {
      query = `
      
        SELECT
            psub.id,
            psub.pos_station_id,
            ps.name pos_station_name,
            psub.type,
            psub.period,
            psub.subscription_packge_id,
            sp.name,
            sp.name_en,
            psub.total_price,
            psub.upgrade_from_pos_subscription_id,
            psub.subscription_start_date,
            psub.subscription_end_date,
            if(subscription_end_date > CURRENT_TIMESTAMP, 1, 0) is_active,
            psub.created
        from
            pos_subscriptions psub
            LEFT JOIN pos_stations ps on ps.id = psub.pos_station_id
            LEFT JOIN subscription_packages sp on sp.id = psub.subscription_packge_id
        WHERE
            pos_hub_manager_id = ${user_id}
            and ps.name like "%${search}%"
        ORDER by
            psub.created DESC
        LIMIT
            ${limit} OFFSET ${offset}
      
      `;

      countQuery = `
      SELECT
          count(psub.id) count
      from
          pos_subscriptions psub
          LEFT JOIN pos_stations ps on ps.id = psub.pos_station_id
          
      where
          pos_hub_manager_id = ${user_id}
          and ps.name like "%${search}%"
      `;
    }

    queryResult = await sequelize.query(query);

    countResult = await sequelize.query(countQuery);

    if (queryResult[0].length != 0)
      res.status(200).json({
        status: true,
        data: queryResult[0],
        tot: countResult[0][0].count,
      });
    else {
      res.status(200).json({
        status: true,
        data: [],
        msg: loadLocaleMessages(lang).pos_products.exceptions
          .not_found,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(200).json({
      status: false,
      msg: loadLocaleMessages(lang).pos_products.exceptions
        .msg_error,
    });
  }
};


exports.getUserProfile = async (req, res, next) => {
  try {
    let result = await conn.users.findOne({
      include: [
        {
          model: conn.user_roles,
          as: "user_roles",
          include: {
            model: conn.roles,
            as: "role",
          },
        },

      ],
      attributes: ["name", "email", "tel"],

      where: { id: req.query.id },
    });
    delete result.pass;

    res.status(200).json({ status: true, data: result });

  } catch (e) {
    res.status(200).json({
      status: false,
      msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى`,
    });
  }
};


exports.resetPass = async (req, res, next) => {
  try {
    let oldPass, newPass;
    oldPass = req.body.old_pass;
    newPass = await bcrypt.hash(req.body.new_pass, 10);
    const dbPassword = await conn.users.findOne({
      where: {
        id: req.body.id,
      },
    });

    const comparePass = await bcrypt.compare(oldPass, dbPassword.pass);
    console.log("compare result  step 452 :", comparePass);

    if (
      comparePass &&
      req.body.new_pass == req.body.confirm_pass &&
      req.body.new_pass.length >= 8
    ) {
      const isUpdated = await conn.users.update(
        { pass: newPass },
        {
          where: { id: req.body.id },
        }
      );
      if (isUpdated) {
        res.status(200).json({
          status: true,
          msg: loadLocaleMessages(req.body.lang).pos_users
            .success.pass_update,
        });
      } else {
        res.status(200).json({
          status: true,
          msg: loadLocaleMessages(req.body.lang).pos_users
            .exceptions.update_error,
        });
      }
    } else if (req.body.new_pass != req.body.confirm_pass) {
      res.status(200).json({
        status: false,
        msg: loadLocaleMessages(req.body.lang).pos_users
          .exceptions.wrong_pass_confirm,
      });
    } else if (req.body.new_pass.length < 8) {
      res.status(200).json({
        status: false,
        msg: loadLocaleMessages(req.body.lang).pos_users
          .exceptions.pass_min_length,
      });
    } else {
      res.status(200).json({
        status: false,
        msg: loadLocaleMessages(req.body.lang).pos_users
          .exceptions.pass_update_wrong,
      });
    }
  } catch (e) {
    res.status(200).json({
      status: false,
      msg: `مشكلة أثناء معالجة البيانات الرجاء المحاول مرة أخرى`,
    });
  }
};
