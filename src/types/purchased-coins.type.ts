export type PurchasedCoinsType = {
  purchasedCoins: {
    idOfCoin: string,
    symbol: string,
    priceUsd: number,
    quantityOfBuyingCoins: number,
    commonPriceUsdOfBuyingCoins: number
  }[],
  commonPriceUsdOfAllCoinsInPortfolio: number
}


