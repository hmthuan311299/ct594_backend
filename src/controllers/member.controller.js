const pool = require('../database');
const model = require('../models/member.model');
var md5 = require('md5');
var jwt = require('jsonwebtoken');
const {responseMemberObject} = require('../helpers')
const getMember = (req, res) =>{
    var currPage = (parseInt(req.query.currPage)*10) || 0;
    pool.query(model.readMember, [currPage], (err, result) => {
        if(err){
            res.json(responseMemberObject(400,'Truy vấn thất bại'));
        } else {
            res.json(responseMemberObject(200,'Kết nối thành công', result.rows));
        }
      })
}
const getBlockedMember = (req, res) =>{
    var currPage = (parseInt(req.query.currPage)*10) || 0;
    pool.query(model.readBlockedMember, [currPage], (err, result) => {
        if(err){
            res.json(responseMemberObject(400,'Truy vấn thất bại'));
        } else {
            res.json(responseMemberObject(200,'Kết nối thành công', result.rows));
        }
      })
}
const getMemberById = (req, res) =>{
    var memberId = req.params.memberId;
    pool.query(model.readMemberById, [memberId], (err, result) => {
        if(err || result.rowCount == 0){
            res.json(responseMemberObject(400,"Không tìm thấy người này trong hệ thống", ""));
        }
        else 
            res.json(responseMemberObject(200,'Kết nối thành công', result.rows[0]));
      })
}
const loginMember = (req, res) =>{
    var {memberEmail, memberPass} = req.body;
    pool.query(model.readLoginMember, [memberEmail, md5(memberPass)], (err, result) => {
        if (err) {
            res.json(responseMemberObject(400,'Truy vấn thất bại'));
        } 
        if(result.rowCount == 0){
            res.json(responseMemberObject(400,'Tài khoản hoặc mật khẩu không chính xác'));
        }
        else{
            var data = result.rows[0];
            if(data.memberstatus == false){
                res.json(responseMemberObject(400,'Tài khoản này đã bị khóa! Vui lòng liên hệ Email: haminhthuan99@gmail.com để phản hồi'));
            }else{
                var data = result.rows[0];
                var dataJWT ={
                    memberid: data.memberid,
                    membername: data.membername,
                    iat: data.memberid
                }
                // var dataJWT ="thuan"
                const access_Token = jwt.sign(dataJWT, "DUNG_CHO_AI_BIET_NHA")
                res.json(responseMemberObject(200,'Đăng nhập thành công', result.rows[0], access_Token));
            }
            
        }
      })
}
const addMember = (req, res, result)=>{
    var {memberEmail, memberPass, memberName, memberAddress, memberGender, memberDesc, memberYearofBirth, memberPhone} = req.body;
    pool.query(model.checkEmailExist, [memberEmail], (err, result)=>{
        if(result.rowCount > 0)
            res.send(responseMemberObject(400,"Email này đã tồn tại trong hệ thống", ""))
        else{
            pool.query(model.insertMember, [memberEmail, md5(memberPass), memberName, memberAddress, memberGender, memberDesc, memberYearofBirth, memberPhone], (error, results)=>{
                if(error) throw error;
                res.send(responseMemberObject(200,"Đăng ký tài khoản thành công"))
            })
        }
    })
}
const setBlockedMember = (req, res, result)=>{
    var memberId = req.params.memberId;
    console.log(memberId)
    pool.query(model.readMemberById, [memberId], (err, result)=>{
        if(result.rowCount > 0){
            pool.query(model.setBlockedMember, [memberId], ()=>{
                res.send(responseMemberObject(200,"Đã khóa người dùng này"))
            })
        }
        else    
            res.send(responseMemberObject(400,"Không tìm thấy người này trong hệ thống"))
    })
}
const setOpenMember = (req, res, result)=>{
    var memberId = req.params.memberId;
    console.log(memberId)
    pool.query(model.readMemberById, [memberId], (err, result)=>{
        if(result.rowCount > 0){
            pool.query(model.setOpenMember, [memberId], ()=>{
                res.send(responseMemberObject(200,"Mở Khóa thành công"))
            })
        }
        else    
            res.send(responseMemberObject(400,"Không tìm thấy người này trong hệ thống"))
    })
}
const updateMember = (req, res, result)=>{
    var memberId = req.params.memberId;
    var {memberName, memberAddress, memberGender, memberYearOfBirth, memberPhone} = req.body;
    if(memberId && memberName && memberGender &&  memberAddress){
        pool.query(model.readMemberById, [memberId], (err, result)=>{
            if(result.rowCount > 0){
                pool.query(model.updateInforMember, [memberName, memberAddress, memberGender, memberYearOfBirth, memberPhone, memberId], (error, results)=>{
                    res.send(responseMemberObject(200,"Cập nhật thông tin thành công"))
                })
            }
            else    
                res.send(responseMemberObject(400,"Không tìm thấy người này trong hệ thống"))
        })
    }else    
        res.send(responseMemberObject(400,"Tham số truyền vào chưa đúng"))
}
const updateMemberHaveAvatar = (req, res, result)=>{
    var memberId = req.params.memberId;
    var {memberName, memberAddress, memberGender, memberYearOfBirth, memberPhone} = req.body;
    var path = req.file.path;
    console.log(path)
    if(memberId && memberName && memberGender &&  memberAddress){
        pool.query(model.uploadAvatarMember, [memberName, memberAddress, memberGender, memberYearOfBirth, memberPhone, path, memberId], (err, result)=>{
            if(err){
                res.send(responseMemberObject(400,"Đã có lỗi xảy ra"))
            }
            else
                res.send(responseMemberObject(200,"Cập nhật thành công"))
        })
    }else    
        res.send(responseMemberObject(400,"Tham số truyền vào chưa đúng"))
    
}
const changePassMember = (req, res, result)=>{
    var {oldPass, newPass, memberId} = req.body;
    if(oldPass, newPass, parseInt(memberId)){
        pool.query(model.readMemberById, [memberId], (err, result)=>{
            if(result.rowCount > 0){
                pool.query(model.checkPassword, [md5(oldPass), memberId], (err, result)=>{
                    if(result.rowCount > 0){
                        pool.query(model.changePassMember, [md5(newPass), memberId], (err, result)=>{
                            if(result.rowCount > 0){
                                res.send(responseMemberObject(200,"Thay đổi mật khẩu thành công"))
                            }
                            else res.send(responseMemberObject(400,"Đã có lỗi xảy ra"))
                        })
                    }
                    else res.send(responseMemberObject(400,"Mật khẩu cũ chưa đúng"))
                })
            }
            else res.send(responseMemberObject(400,"Không tìm thấy người này trong hệ thống"))
        })

    }else{
        res.send(responseMemberObject(400,"Tham số truyền vào chưa đúng"))
    }
}
const deleteMember = (req, res, result)=>{
    var memberId = req.params.memberId;
    console.log(memberId)
    if(memberId){
        pool.query(model.readMemberById, [memberId], (err, result)=>{
            if(result.rowCount > 0){
                pool.query(model.deleteMember, [memberId], (error, results)=>{
                    res.send(responseMemberObject(200, "Xóa thành công"));
                })
            }
            else    
                res.send(responseMemberObject(400,"Không tìm thấy người này trong hệ thống"));
        })
    }else{
        res.send(responseMemberObject(400,"Tham số truyền vào chưa đúng"))
    }
}
module.exports = 
{
    getMember, loginMember, getMemberById, addMember, updateMember, 
    changePassMember, deleteMember, 
    updateMemberHaveAvatar, getBlockedMember, setBlockedMember,
    setOpenMember
};
