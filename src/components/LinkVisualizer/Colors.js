import {Color} from 'three';

let colorMap = {
    lightGreen: new Color(0x55efc4),
    darkGreen: new Color(0x00b894),

    lightTurquoise: new Color(0x81ecec),
    darkTurquoise: new Color(0x81ecec),

    lightBlue: new Color(0x74b9ff),
    darkBlue: new Color(0x74b9ff),

    lightPurple: new Color(0xa29bfe),
    darkPurple: new Color(0x6c5ce7),

    lightYellow: new Color(0xffeaa7),
    darkYellow: new Color(0xfdcb6e),
    
    lightOrange: new Color(0xfab1a0),
    darkOrange: new Color(0xe17055),

    lightRed: new Color(0xff7675),
    darkRed: new Color(0xd63031),

    lightPink: new Color(0xfd79a8),
    darkPink: new Color(0xe84393),
}

export const colors = Object.values(colorMap);
