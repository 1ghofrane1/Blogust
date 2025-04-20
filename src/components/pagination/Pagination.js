"use client";

import React from "react";
import styles from "./pagination.module.css";
import { useRouter, useSearchParams } from "next/navigation";

const Pagination = ({ page, hasPrev, hasNext }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const cat = searchParams.get("cat");

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams();
    params.set("page", newPage);
    if (cat) params.set("cat", cat);

    router.push(`?${params.toString()}`);
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        disabled={!hasPrev}
        onClick={() => handlePageChange(page - 1)}
      >
        Previous
      </button>
      <button
        disabled={!hasNext}
        className={styles.button}
        onClick={() => handlePageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
