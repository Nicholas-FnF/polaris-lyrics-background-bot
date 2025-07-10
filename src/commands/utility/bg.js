const { interactionError } = require("../../lib/interaction-error");
const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { createCanvas } = require("canvas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bg")
    .setDescription(
      "Generates and sends a gradient background with a dominant color."
    ),

  async execute(interaction) {
    try {
      // Popular mid-to-bright non-gray, non-greenish colors
      const popularColors = [
        { name: "dodgerblue", rgb: { r: 30, g: 144, b: 255 } },
        { name: "royalblue", rgb: { r: 65, g: 105, b: 225 } },
        { name: "mediumslateblue", rgb: { r: 123, g: 104, b: 238 } },
        { name: "tomato", rgb: { r: 255, g: 99, b: 71 } },
        { name: "orangered", rgb: { r: 255, g: 69, b: 0 } },
        { name: "gold", rgb: { r: 255, g: 215, b: 0 } },
        { name: "hotpink", rgb: { r: 255, g: 105, b: 180 } },
        { name: "deeppink", rgb: { r: 255, g: 20, b: 147 } },
        { name: "violet", rgb: { r: 238, g: 130, b: 238 } },
        { name: "mediumvioletred", rgb: { r: 199, g: 21, b: 133 } },
      ];

      // Pick a random dominant color from the list
      const dominantEntry =
        popularColors[Math.floor(Math.random() * popularColors.length)];
      const dominant = dominantEntry.rgb;

      // Create lighter version by blending towards white (50% blend for brighter)
      const lighter = {
        r: Math.round(dominant.r + (255 - dominant.r) * 0.5),
        g: Math.round(dominant.g + (255 - dominant.g) * 0.5),
        b: Math.round(dominant.b + (255 - dominant.b) * 0.5),
      };

      // Create canvas
      const width = 1920;
      const height = 1080;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      // Create gradient (top: dominant, bottom: lighter)
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(
        0,
        `rgb(${dominant.r}, ${dominant.g}, ${dominant.b})`
      );
      gradient.addColorStop(1, `rgb(${lighter.r}, ${lighter.g}, ${lighter.b})`);

      // Fill gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Convert to buffer and attachment
      const buffer = canvas.toBuffer("image/png");
      const attachment = new AttachmentBuilder(buffer, {
        name: "gradient.png",
      });

      // Reply with image
      await interaction.reply({
        content: `Here is your generated gradient background:`,
        files: [attachment],
      });
    } catch (error) {
      await interactionError(interaction, error);
    }
  },
};
