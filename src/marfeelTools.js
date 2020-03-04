/*
 * Copyright (c) 2019 by Marfeel Solutions (http://www.marfeel.com)
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Marfeel Solutions S.L and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Marfeel Solutions S.L and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Marfeel Solutions SL.
 */

const utils = require('./utils.js');
const { auctionManager } = require('./auctionManager');

var lastLocation;

const VIDEO_SIZE = [1, 1];
const LARGE_SIZE_NORMALIZED = '300x250';

export const getLastLocation = () => lastLocation;

const extractLastLocationFromArray = (adUnitArr) => (
  adUnitArr &&
  adUnitArr[0] &&
  adUnitArr[0].bids &&
  adUnitArr[0].bids[0] &&
  adUnitArr[0].bids[0].params &&
  adUnitArr[0].bids[0].params.referrer) ? adUnitArr[0].bids[0].params.referrer : '';

const extractLastLocationFromObject = (adUnitArr) => (
  adUnitArr &&
  adUnitArr.bids &&
  adUnitArr.bids[0] &&
  adUnitArr.bids[0].params &&
  adUnitArr.bids[0].params.referrer) ? adUnitArr.bids[0].params.referrer : '';

export const setLastLocationFromLastAdUnit = (adUnitArr) => {
  if (utils.isArray(adUnitArr)) {
    lastLocation = extractLastLocationFromArray(adUnitArr);
  } else {
    lastLocation = extractLastLocationFromObject(adUnitArr);
  }
}

const normalizeSizes = sizesArray => sizesArray.join('x');
export const allow1x1ForLargeSizes = (allowedSizes) => (allowedSizes.map(normalizeSizes)
  .includes(LARGE_SIZE_NORMALIZED)) ? [...allowedSizes, VIDEO_SIZE] : allowedSizes;

export const getCurrentAuctionSizes = () => {
  const lastAdUnitUsed = [...auctionManager.getAdUnits()].pop();

  if (lastAdUnitUsed &&
      lastAdUnitUsed.mediaTypes &&
      lastAdUnitUsed.mediaTypes['banner'] &&
      lastAdUnitUsed.mediaTypes['banner'].sizes
  ) {
    return allow1x1ForLargeSizes(lastAdUnitUsed.mediaTypes['banner'].sizes);
  }

  return [];
}

export const isBidSizeAllowed = (bid, allowedSizes) => {
  const allowedSizesNormalized = allowedSizes.map(normalizeSizes);
  const bidSize = normalizeSizes([bid.width, bid.height]);

  return allowedSizesNormalized.includes(bidSize);
}
