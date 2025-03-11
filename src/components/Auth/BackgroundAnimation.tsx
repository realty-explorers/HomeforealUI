import React from 'react';

const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-50">
      {/* Tech grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-70"></div>

      {/* AI dot pattern overlay */}
      <div className="absolute inset-0 ai-dots-pattern opacity-80"></div>

      {/* Animated gradient elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        {/* Animated circles */}
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl animate-floating"
          style={{ animationDelay: '0s' }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary-purple/10 rounded-full blur-3xl animate-floating"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-2/3 left-1/3 w-72 h-72 bg-sky-100/30 rounded-full blur-3xl animate-floating"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-floating"
          style={{ animationDelay: '3s' }}
        ></div>
      </div>

      {/* Tech grid animated overlay */}
      <div className="absolute inset-0 tech-grid-animated"></div>

      {/* Noise overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1Ii8+PC9zdmc+')] opacity-30"></div>
    </div>
  );
};

export default BackgroundAnimation;
