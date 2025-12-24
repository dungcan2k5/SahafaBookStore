const { models, sequelize } = require('../config/database');
const { Address } = models;

// [GET] /api/addresses - Lấy danh sách địa chỉ của user hiện tại
const getMyAddresses = async (req, res) => {
  try {
    // LƯU Ý: Kiểm tra lại middleware xác thực của bạn. 
    // Thông thường biến này nằm ở req.user.user_id thay vì req.user_id
    // Nếu code dưới không chạy, hãy thử đổi req.user_id thành req.user.user_id
    const userId = req.user_id || (req.user && req.user.user_id); 

    const addresses = await Address.findAll({
      where: { user_id: userId },
      // SỬA LỖI TẠI ĐÂY:
      // Thay vì sắp xếp theo 'created_at' (không tồn tại), ta sắp xếp theo 'address_id'.
      // Vì id tự tăng nên id lớn hơn nghĩa là tạo sau (mới nhất).
      order: [
        ['is_default', 'DESC'], // Mặc định lên đầu
        ['address_id', 'DESC']  // Mới nhất lên đầu (dựa theo ID)
      ] 
    });
    res.json({ success: true, data: addresses });
  } catch (error) {
    console.error("Get Address Error:", error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// [POST] /api/addresses - Thêm địa chỉ mới
const addAddress = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { recipient_name, phone, address_detail, is_default } = req.body;
    const userId = req.user_id || (req.user && req.user.user_id);

    // Kiểm tra xem user đã có địa chỉ nào chưa
    const count = await Address.count({ where: { user_id: userId } });
    
    // Nếu chưa có cái nào -> Cái đầu tiên auto là mặc định
    // Hoặc user chủ động chọn là mặc định
    const shouldBeDefault = count === 0 || is_default;

    if (shouldBeDefault) {
      // Bỏ default của tất cả các địa chỉ cũ
      await Address.update({ is_default: false }, { 
        where: { user_id: userId },
        transaction: t 
      });
    }

    const newAddr = await Address.create({
      user_id: userId,
      recipient_name,
      phone,
      address_detail,
      is_default: shouldBeDefault
    }, { transaction: t });

    await t.commit();
    res.status(201).json({ success: true, message: 'Thêm địa chỉ thành công', data: newAddr });
  } catch (error) {
    await t.rollback();
    console.error("Add Address Error:", error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// [PUT] /api/addresses/:id - Cập nhật địa chỉ
const updateAddress = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { recipient_name, phone, address_detail, is_default } = req.body;
    const userId = req.user_id || (req.user && req.user.user_id);

    const addr = await Address.findOne({ where: { address_id: id, user_id: userId } });
    if (!addr) {
        await t.rollback();
        return res.status(404).json({ success: false, message: 'Không tìm thấy địa chỉ' });
    }

    // Nếu user muốn đặt cái này làm mặc định
    if (is_default) {
      // Reset các cái khác về false
      await Address.update({ is_default: false }, { 
        where: { user_id: userId },
        transaction: t 
      });
    }

    await addr.update({
      recipient_name,
      phone,
      address_detail,
      is_default: is_default !== undefined ? is_default : addr.is_default
    }, { transaction: t });

    await t.commit();
    res.json({ success: true, message: 'Cập nhật thành công' });
  } catch (error) {
    await t.rollback();
    console.error("Update Address Error:", error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// [DELETE] /api/addresses/:id - Xóa địa chỉ
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user_id || (req.user && req.user.user_id);

    // Chỉ cho phép xóa địa chỉ của chính mình
    const deleted = await Address.destroy({ where: { address_id: id, user_id: userId } });
    
    if (!deleted) return res.status(404).json({ success: false, message: 'Không tìm thấy địa chỉ hoặc không có quyền xóa' });
    
    res.json({ success: true, message: 'Đã xóa địa chỉ' });
  } catch (error) {
    console.error("Delete Address Error:", error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = { getMyAddresses, addAddress, updateAddress, deleteAddress };