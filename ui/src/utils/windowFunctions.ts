const constructGoogleSearchUrl = (address: string) => {
    const url = `https://www.google.com/search?q=${address}`;
    return url;
};
const openGoogleSearch = (address: string) => {
    const url = constructGoogleSearchUrl(address);
    window.open(url, '_blank', 'noopener,noreferrer');
};

export { constructGoogleSearchUrl, openGoogleSearch }