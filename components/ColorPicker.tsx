import { useEffect, useState } from "react";
import { RgbColorPicker } from "react-colorful";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { useDebouncyEffect } from "use-debouncy";
import useFirebase from "./FirebaseContext";
import useColor, { AllColors, Color } from "./ColorContext";

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

const saveColor = async (color: AllColors) => {
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
  }, [color.r, color.g, color.b]);
  useDebouncyEffect(
    () => {
      saveColor(color);
    },
    500,
    [color.r, color.g, color.b]
  );
  console.log("color", color);
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-white w-72 shadow-2xl rounded-lg">
        <RgbColorPicker
          placeholder={`${color.r}, ${color.g}, ${color.b}`}
          className="!w-full !h-64"
          color={{ r: color.r, g: color.g, b: color.b }}
          onChange={(c) => {
            console.log(c);
            setColor({ ...c, rainbow: false });
          }}
        />
        <div className="flex rounded-b-lg overflow-hidden px-2 py-2 gap-2">
          <div className="w-1/2">
            <label className="mx-auto w-full">
              <p className="text-center text-gray-600 text-sm font-light">
                hex
              </p>
              <input
                className="w-full text-center border-2 rounded-md border-gray-300"
                type="text"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                onBlur={(e) => {
                  const converted = hexToRgb(e.target.value);
                  if (converted) {
                    setColor({ ...converted, rainbow: false });
                    saveColor({ ...converted, rainbow: false });
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
              <p className="text-center text-gray-600 text-sm font-light">
                rgb
              </p>
              <input
                className="w-full text-center border-2 rounded-md border-gray-300"
                type="text"
                value={rgb}
                onChange={(e) => setRgb(e.target.value)}
                onBlur={(e) => {
                  const nums = e.target.value
                    .split(", ")
                    .map((n) => parseInt(n));
                  if (
                    nums.length === 3 &&
                    nums.every((num) => !isNaN(num) && num >= 0 && num <= 255)
                  ) {
                    const newColor = { r: nums[0], g: nums[1], b: nums[2] };
                    setColor({ ...newColor, rainbow: false });
                    saveColor({ ...newColor, rainbow: false });
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
      <div>
        <button
          onClick={() => {
            saveColor({ ...color, rainbow: !color.rainbow });
            setColor({ ...color, rainbow: !color.rainbow });
          }}
          className="flex items-center gap-2 text-white bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 border-white border-2 rounded-xl px-4 py-1.5"
        >
          Rainbow{" "}
          {color.rainbow && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default ColorPicker;
