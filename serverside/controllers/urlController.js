const shortid = require("shortid");
const Url = require("../models/Url");

const generateShortUrl = async (req, res) => {
  try {
    const { url } = req.body;
    let exp =
      /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (!url.match(exp)) {
      return res.status(400).json({ message: "Url is not valid!" });
    }
    const shortId = shortid();
    await Url.create({
      shortId: shortId,
      realUrl: url,
      analytics: { visitHistory: [] },
      createdBy: req.user.userId,
    });
    res.json({ id: shortId });
  } catch (error) {
    res.json({ error });
  }
};

const getUrls = async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await Url.find({ createdBy: req.user.userId });
    return res.json({ result });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteUrl = async (req, res) => {
  try {
    const { id } = req.body;
    const result = await Url.deleteOne({ _id: id });
    res.status(200).json({ message: "Deleted Sucessfully !" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editUrl = async (req, res) => {
  try {
    const { id, newUrl } = req.body;
    const result = await Url.findOneAndUpdate(
      { createdBy: req.user.userId, _id: id },
      {
        $set: {
          shortId: shortid(),
          realUrl: newUrl,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json({ message: "Updated Sucessfully !", url: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const { urlId } = req.params;

    if (!urlId) {
      return res.status(400).json({ message: "Url Id is Required." });
    }

    const result = await Url.findOne({ _id: urlId });
    if (req.user.userId != result.createdBy) {
      return res
        .status(400)
        .json({ message: "You are not a authorized user." });
    }
    return res.json({
      totalClicks: result.analytics.visitHistory.length,
      visitHistory: result.analytics.visitHistory,
      shortId: result.shortId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateShortUrl,
  getUrls,
  deleteUrl,
  editUrl,
  getAnalytics,
};
