import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

/**
 * Card component với class Tailwind mặc định.
 * Có thể truyền thêm className nếu cần custom.
 */
export function Card({ children, className }) {
  return (
    <div
      className={clsx(
        "bg-white rounded-2xl shadow-md border p-4",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * CardContent giúp tách nội dung chính ra, nếu cần custom layout bên trong card.
 */
export function CardContent({ children, className }) {
  return (
    <div className={clsx("p-2", className)}>
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

CardContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
