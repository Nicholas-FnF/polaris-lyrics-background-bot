const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { interactionError } = require("../../lib/interaction-error");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resize")
    .setDescription("Resize an uploaded image to 1920x1080")
    .addAttachmentOption((option) =>
      option
        .setName("image")
        .setDescription("Image to resize")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("darken")
        .setDescription("Percentage to darken the image (0-100, default: 0)")
        .setMinValue(0)
        .setMaxValue(100)
        .setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply();
    try {
      const attachment = interaction.options.getAttachment("image");
      if (!attachment || !attachment.url) {
        throw new Error("No image attachment provided.");
      }

      // Load image via canvas
      const img = await loadImage(attachment.url);

      const width = 1920;
      const height = 1080;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Fill background black (in case image has transparency)
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);

      // Cover-style resize: scale the image to fully cover 1920x1080 and center-crop
      const iw = img.width;
      const ih = img.height;
      const scale = Math.max(width / iw, height / ih);
      const nw = iw * scale;
      const nh = ih * scale;
      const dx = (width - nw) / 2;
      const dy = (height - nh) / 2;

      ctx.drawImage(img, dx, dy, nw, nh);

      // Apply darkening if specified
      const darkenPercent = interaction.options.getInteger("darken") ?? 0;
      if (darkenPercent > 0) {
        const alpha = darkenPercent / 100;
        ctx.fillStyle = `rgba(0,0,0,${alpha})`;
        ctx.fillRect(0, 0, width, height);
      }

      const buffer = canvas.toBuffer("image/png");
      const outName = "resized.png";
      const file = new AttachmentBuilder(buffer, { name: outName });

      await interaction.editReply({
        content: "Here is your resized image:",
        files: [file],
      });
    } catch (error) {
      await interactionError(interaction, error);
    }
  },
};
