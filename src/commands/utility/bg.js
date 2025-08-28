const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { interactionError } = require("../../lib/interaction-error");
const { createCanvas } = require("canvas");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bg")
    .setDescription("Generates a gradient background."),

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
        { name: "crimson", rgb: { r: 220, g: 20, b: 60 } },
        { name: "salmon", rgb: { r: 250, g: 128, b: 114 } },
        { name: "coral", rgb: { r: 255, g: 127, b: 80 } },
        { name: "orange", rgb: { r: 255, g: 165, b: 0 } },
        { name: "darkorange", rgb: { r: 255, g: 140, b: 0 } },
        { name: "lightcoral", rgb: { r: 240, g: 128, b: 128 } },
        { name: "indianred", rgb: { r: 205, g: 92, b: 92 } },
        { name: "orchid", rgb: { r: 218, g: 112, b: 214 } },
        { name: "plum", rgb: { r: 221, g: 160, b: 221 } },
        { name: "fuchsia", rgb: { r: 255, g: 0, b: 255 } },
        { name: "magenta", rgb: { r: 255, g: 0, b: 255 } },
        { name: "darkmagenta", rgb: { r: 139, g: 0, b: 139 } },
        { name: "blueviolet", rgb: { r: 138, g: 43, b: 226 } },
        { name: "mediumorchid", rgb: { r: 186, g: 85, b: 211 } },
        { name: "slateblue", rgb: { r: 106, g: 90, b: 205 } },
        { name: "mediumblue", rgb: { r: 0, g: 0, b: 205 } },
        { name: "deepskyblue", rgb: { r: 0, g: 191, b: 255 } },
        { name: "lightskyblue", rgb: { r: 135, g: 206, b: 250 } },
        { name: "skyblue", rgb: { r: 135, g: 206, b: 235 } },
        { name: "lightsteelblue", rgb: { r: 176, g: 196, b: 222 } },
        { name: "steelblue", rgb: { r: 70, g: 130, b: 180 } },
        { name: "powderblue", rgb: { r: 176, g: 224, b: 230 } },
        { name: "lightblue", rgb: { r: 173, g: 216, b: 230 } },
        { name: "turquoise", rgb: { r: 64, g: 224, b: 208 } },
        { name: "darkturquoise", rgb: { r: 0, g: 206, b: 209 } },
        { name: "lightseagreen", rgb: { r: 32, g: 178, b: 170 } },
        { name: "cadetblue", rgb: { r: 95, g: 158, b: 160 } },
        { name: "lightsalmon", rgb: { r: 255, g: 160, b: 122 } },
        { name: "mistyrose", rgb: { r: 255, g: 228, b: 225 } },
        { name: "lavenderblush", rgb: { r: 255, g: 240, b: 245 } },
        { name: "palevioletred", rgb: { r: 219, g: 112, b: 147 } },
        { name: "lightpink", rgb: { r: 255, g: 182, b: 193 } },
        { name: "pink", rgb: { r: 255, g: 192, b: 203 } },
        { name: "rosybrown", rgb: { r: 188, g: 143, b: 143 } },
        { name: "peachpuff", rgb: { r: 255, g: 218, b: 185 } },
        { name: "bisque", rgb: { r: 255, g: 228, b: 196 } },
        { name: "navajowhite", rgb: { r: 255, g: 222, b: 173 } },
        { name: "moccasin", rgb: { r: 255, g: 228, b: 181 } },
        { name: "blanchedalmond", rgb: { r: 255, g: 235, b: 205 } },
        { name: "lavender", rgb: { r: 230, g: 230, b: 250 } },
        { name: "thistle", rgb: { r: 216, g: 191, b: 216 } },
        { name: "lightcyan", rgb: { r: 224, g: 255, b: 255 } },
        { name: "aqua", rgb: { r: 0, g: 255, b: 255 } },
        { name: "cyan", rgb: { r: 0, g: 255, b: 255 } },
        { name: "chartreuse", rgb: { r: 127, g: 255, b: 0 } },
        { name: "yellow", rgb: { r: 255, g: 255, b: 0 } },
        { name: "lemonchiffon", rgb: { r: 255, g: 250, b: 205 } },
        { name: "lightgoldenrodyellow", rgb: { r: 250, g: 250, b: 210 } },
        { name: "khaki", rgb: { r: 240, g: 230, b: 140 } },
        { name: "palegoldenrod", rgb: { r: 238, g: 232, b: 170 } },
        { name: "burlywood", rgb: { r: 222, g: 184, b: 135 } },
        { name: "sandybrown", rgb: { r: 244, g: 164, b: 96 } },
        { name: "lightslateblue", rgb: { r: 132, g: 112, b: 255 } },
        { name: "mediumturquoise", rgb: { r: 72, g: 209, b: 204 } },
        { name: "paleturquoise", rgb: { r: 175, g: 238, b: 238 } },
        { name: "lightseagreen", rgb: { r: 32, g: 178, b: 170 } },
        { name: "dodgerblue", rgb: { r: 30, g: 144, b: 255 } },
        { name: "midnightblue", rgb: { r: 25, g: 25, b: 112 } },
        { name: "darkorchid", rgb: { r: 153, g: 50, b: 204 } },
        { name: "rebeccapurple", rgb: { r: 102, g: 51, b: 153 } },
        { name: "firebrick", rgb: { r: 178, g: 34, b: 34 } },
        { name: "maroon", rgb: { r: 128, g: 0, b: 0 } },
        { name: "chocolate", rgb: { r: 210, g: 105, b: 30 } },
        { name: "sienna", rgb: { r: 160, g: 82, b: 45 } },
        { name: "peru", rgb: { r: 205, g: 133, b: 63 } },
        { name: "tan", rgb: { r: 210, g: 180, b: 140 } },
        { name: "darkgoldenrod", rgb: { r: 184, g: 134, b: 11 } },
        { name: "lightyellow", rgb: { r: 255, g: 255, b: 224 } },
        { name: "antiquewhite", rgb: { r: 250, g: 235, b: 215 } },
        { name: "linen", rgb: { r: 250, g: 240, b: 230 } },
        { name: "oldlace", rgb: { r: 253, g: 245, b: 230 } },
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
