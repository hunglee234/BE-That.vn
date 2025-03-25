const Contract = require("../../models/contract/Contract");

exports.createContract = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const contract = new Contract({
      name,
      description,
    });

    await contract.save();
    return res.status(200).json({
      message: "Tạo hợp đồng thành công",
      data: {
        contract: contract,
      },
    });
  } catch (error) {
    console.log("Lỗi khi tạo hợp đồng", error.message);
    return res.status(500).json({
      message: "Có lỗi khi tạo hợp đồng, vui lòng thử lại sau",
    });
  }
};
