import { useEffect, useState } from "react";
import { RgbColorPicker } from "react-colorful";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { useDebouncyEffect } from "use-debouncy";
import useFirebase from "./FirebaseContext";
import useColor, { Color } from "./ColorContext";

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
  const db = getDatabase();
  await set(ref(db, "color"), color);
};
const ColorPicker = () => {
  const { color, setColor } = useColor();
  const [hex, setHex] = useState(rgbToHex(color));
  const [rgb, setRgb] = useState(`${color.r}, ${color.g}, ${color.b}`);
  const firebaseApp = useFirebase();
  useEffect(() => {
    if (!firebaseApp) return;
    const unsubscribe = onValue(ref(getDatabase(), "color"), (snapshot) => {
      setColor(snapshot.val());
    });
    return () => unsubscribe();
  }, [firebaseApp]);
  useEffect(() => {
    setHex(rgbToHex(color));
    setRgb(`${color.r}, ${color.g}, ${color.b}`);
  }, [color]);
  useDebouncyEffect(
    () => {
      saveColor(color);
    },
    500,
    [color]
  );
  return (
    <div className="bg-white w-72 shadow-2xl rounded-lg">
      <RgbColorPicker
        className="!w-full !h-64"
        color={color}
        onChange={(c) => {
          setColor(c);
        }}
      />
      <div className="flex rounded-b-lg overflow-hidden px-2 py-2 gap-2">
        <div className="w-1/2">
          <label className="mx-auto w-full">
            <p className="text-center text-gray-600 text-sm font-light">hex</p>
            <input
              className="w-full text-center border-2 rounded-md border-gray-300"
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  (e.target as HTMLElement).blur();
                }
              }}
            />
          </label>
        </div>
        <div className="w-1/2">
          <label>
            <p className="text-center text-gray-600 text-sm font-light">rgb</p>
            <input
              className="w-full text-center border-2 rounded-md border-gray-300"
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  (e.target as HTMLElement).blur();
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
