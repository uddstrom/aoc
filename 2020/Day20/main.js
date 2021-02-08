const fs = require('fs');
const { parseTiles } = require('./parse');
const { getPuzzleConfig } = require('./puzzleConfig');
const { printImage, printPuzzleConfig } = require('./printing');

const matchTile = (tile, tiles) => {
    const findMatchingTile = (border) => {
        return tiles
            .filter(t => t.id !== tile.id)
            .find(t => t.bordersA.includes(border) || t.bordersB.includes(border))?.id;
    };

    tile.matchesA = [
        findMatchingTile(tile.bordersA[0]),
        findMatchingTile(tile.bordersA[1]),
        findMatchingTile(tile.bordersA[2]),
        findMatchingTile(tile.bordersA[3]),
    ];

    tile.matchesB = [
        findMatchingTile(tile.bordersB[0]),
        findMatchingTile(tile.bordersB[1]),
        findMatchingTile(tile.bordersB[2]),
        findMatchingTile(tile.bordersB[3]),
    ];

    tile.matches = [...tile.matchesA];

    return tile;
};

const matchTiles = (tiles) => {
    tiles.forEach(tile => matchTile(tile, tiles));
};

const assembleImage = (puzzleConfig, tiles) => {
    const tileSize = 8;
    const puzzleData = puzzleConfig.map(row => row.map(tile => tiles.find(t => t.id === tile.id).noBorders())); //row.map(pId => tiles.find(t => t.id === pId).noBorders()));
    const image = [];

    puzzleData.forEach(puzzleRow => {
        for (tileRow = 0; tileRow < tileSize; tileRow++) {
            image.push(puzzleRow.map(puzzleTile => puzzleTile[tileRow]).join(''));
        }
    })

    return image;
};

fs.readFile('Day20/input', 'utf8', function (err, contents) {
    const tiles = parseTiles(contents);
    matchTiles(tiles);

    const corners = tiles.filter(tile => tile.isCorner()).map(tile => tile.id);
    console.log('Part 1:', corners.reduce((acc, id) => acc * id));

    /*
    Find the tile order (puzzleConfig)
    Put together the image
    Search for sea monsters
    Count # not part of the sea monster
    */

    const config = getPuzzleConfig(tiles);
    printPuzzleConfig(config);
    const image = assembleImage(config, tiles);
    printImage(image);
});



