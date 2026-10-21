export type Photo = {
  id: string;
  uri: string;
  width: number; // known up front, so the box can be reserved before loading
  height: number;
};

const picsum = (id: number, w: number, h: number): Photo => ({
  id: `picsum-${id}`,
  uri: `https://picsum.photos/id/${id}/${w}/${h}`,
  width: w,
  height: h,
});

export const PHOTOS: Photo[] = [
  picsum(10, 600, 400),
  picsum(11, 400, 600),
  picsum(12, 600, 600),
  picsum(13, 600, 400),
  // Deliberately broken: returns 404, so onError shows the bundled placeholder.
  {
    id: "broken",
    uri: "https://httpbin.org/status/404",
    width: 600,
    height: 400,
  },
  picsum(14, 400, 600),
  picsum(15, 600, 400),
  picsum(16, 600, 600),
];
