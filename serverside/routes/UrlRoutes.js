const { Router } = require("express");
const {
  generateShortUrl,
  getUrls,
  deleteUrl,
  editUrl,
  getAnalytics,
} = require("../controllers/urlController");
const Url = require("../models/Url");
const { Auth } = require("../middlewares/auth");
const router = Router();

router.route("/getShortUrl").post(Auth, generateShortUrl);

router.route("/urls").get(Auth, getUrls);
router.route("/deleteUrl").post(Auth, deleteUrl);
router.route("/editUrl").post(Auth, editUrl);
router.route("/analytics/:urlId").get(Auth, getAnalytics);
router.route("/:shortId").get(async (req, res) => {
  const { shortId } = req.params;
  console.log(shortId);
  const updated = await Url.findOneAndUpdate(
    { shortId },
    {
      $push: {
        "analytics.visitHistory": {
          time: new Date(),
        },
      },
    }
  );
  console.log(updated);
  return res.redirect(updated.realUrl);
});

module.exports = router;
