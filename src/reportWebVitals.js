
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getTTFB }) => {
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;

