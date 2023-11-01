import { Color, HEX, RGB, RGBA } from "common/types";

export function validateTypeColor(value: string): Color | HEX {
    const rgbPattern = /^rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)$/;
    const rgbaPattern = /^rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*(0(\.\d{1,2})?|1(\.0{1,2})?)\)$/;
    const hexPattern = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;

    if (rgbPattern.test(value)) {
        return value as RGB;
    } else if (rgbaPattern.test(value)) {
        return value as RGBA;
    } else if (hexPattern.test(value)) {
        return value as HEX;
    } else {
        return "#000000" as HEX;
    }
}
