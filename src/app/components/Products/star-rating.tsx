import React, { MouseEventHandler } from "react";
interface IStarRatingProps {
  rating: number;
  maxRating: number;
  onStarClick?: MouseEventHandler<HTMLButtonElement>;
}
const StarRating = ({ rating, maxRating, onStarClick }: IStarRatingProps) => {
  return (
    <div className="items-center">
      {rating}
      {new Array(maxRating).fill("").map((el, index) => (
        <button
          key={index}
          className={`${
            index + 1 <= rating ? "text-yellow-600" : "text-gray-400"
          } text-2xl           `}
          onClick={onStarClick}
        >
          &#9733;
        </button>
      ))}
    </div>
  );
};

export default StarRating;
