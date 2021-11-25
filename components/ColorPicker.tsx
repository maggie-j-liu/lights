import { useEffect, useState } from "react";
import { RgbColorPicker } from "react-colorful";
import { getDatabase, ref, set } from "firebase/database";
import { getApp } from "@firebase/app";
import { useDebouncyEffect } from "use-debouncy";

export interface Color {
  r: number;
  g: number;
  b: number;
}

const rgbToHex = ({ r, g, b }: { r: number; g: number; b: number }) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const saveColor = async (color: Color) => {
  const app = getApp();
  console.log(app);
  const db = getDatabase();
  await set(ref(db, "color"), color);
};
const ColorPicker = ({ initialColor }: { initialColor: Color }) => {
  const [color, setColor] = useState(initialColor);
  const [value, setValue] = useState(initialColor);
  const [hex, setHex] = useState(rgbToHex(initialColor));
  const [rgb, setRgb] = useState(
    `${initialColor.r}, ${initialColor.g}, ${initialColor.b}`
  );
  useEffect(() => {
    setHex(rgbToHex(color));
    setRgb(`${color.r}, ${color.g}, ${color.b}`);
  }, [color]);
  useDebouncyEffect(
    () => {
      setColor(value);
      saveColor(value);
    },
    200,
    [value]
  );
  return (
    <div className="w-72 shadow-xl rounded-b-lg">
      <RgbColorPicker
        className="!w-full !h-64"
        color={value}
        onChange={setValue}
      />
      <div className="flex rounded-b-lg overflow-hidden px-2 py-2">
        <div className="w-1/2">
          <label className="mx-auto w-full">
            <p className="text-center">hex</p>
            <input
              className="w-full text-center"
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              onBlur={(e) => {
                const converted = hexToRgb(e.target.value);
                if (converted) {
                  setColor(converted);
                  saveColor(converted);
                } else {
                  setHex(rgbToHex(color));
                }
              }}
            />
          </label>
        </div>
        <div className="w-1/2">
          <label>
            <p className="text-center">rgb</p>
            <input
              className="w-full text-center"
              type="text"
              value={rgb}
              onChange={(e) => setRgb(e.target.value)}
              onBlur={(e) => {
                const nums = e.target.value.split(", ").map((n) => parseInt(n));
                if (
                  nums.length === 3 &&
                  nums.every((num) => !isNaN(num) && num >= 0 && num <= 255)
                ) {
                  const newColor = { r: nums[0], g: nums[1], b: nums[2] };
                  setColor(newColor);
                  saveColor(newColor);
                } else {
                  setRgb(`${color.r}, ${color.g}, ${color.b}`);
                }
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
