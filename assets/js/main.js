$('.link-share-btn').on('click', () => {
    if (navigator.share) {
        navigator.share({
            title: 'Web Share API Draft',
            url: window.location,
        })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
    } else {
        console.log('Share not supported on this browser, do it the old way.');
    }
});