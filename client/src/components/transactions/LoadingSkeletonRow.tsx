interface Props {
  index: number;
}

const widths = ["60%", "55%", "70%", "80%", "65%", "50%", "75%"];

export default function LoadingSkeletonRow({ index }: Props) {
  const w = (i: number) => widths[(index + i) % widths.length];

  return (
    <tr className="tx-skeleton-row" aria-hidden="true">
      <td>
        <div className="skeleton-cell" style={{ width: w(0) }} />
      </td>
      <td>
        <div className="skeleton-cell" style={{ width: w(1) }} />
      </td>
      <td>
        <div
          className="skeleton-cell"
          style={{ width: w(2), borderRadius: "99px" }}
        />
      </td>
      <td>
        <div className="skeleton-cell" style={{ width: w(3) }} />
      </td>
      <td style={{ textAlign: "right" }}>
        <div
          className="skeleton-cell"
          style={{ width: w(4), marginLeft: "auto" }}
        />
      </td>
      <td>
        <div className="skeleton-cell" style={{ width: w(5) }} />
      </td>
      <td />
    </tr>
  );
}
