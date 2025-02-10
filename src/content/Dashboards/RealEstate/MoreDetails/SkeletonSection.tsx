import { Skeleton } from "@mui/material";

const SkeletonSection = () => {
  return (
    <div className="flex flex-col p-4 max-h-full">
      <div className="grid grid-cols-[2fr_1fr] grid-rows-2 gap-4 mt-4 h-80">
        <Skeleton
          variant="rounded"
          width="100%"
          className="row-span-2"
          height="100%"
        />

        <Skeleton
          variant="rounded"
          width="100%"
          height="100%"
        />
        <Skeleton
          variant="rounded"
          width="100%"
          height="100%"
        />
      </div>
      <div className="flex items-center">
        <div className="flex flex-col w-1/2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="3rem" />
          <Skeleton variant="text" width="40%" />
        </div>

        <div className="flex gap-x-8 w-1/2">
          <Skeleton
            variant="text"
            width="50%"
            height="10rem"
          />
          <Skeleton variant="text" width="50%" />
        </div>
      </div>
      <div className="flex flex-col w-full gap-4">
        <Skeleton
          variant="rounded"
          width="100%"
          height="20rem"
        />
      </div>
    </div>
  );
};

export default SkeletonSection;
