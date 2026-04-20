import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "../App";

describe("training flow", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("lets the user finish a 3x3 training session and review it in history", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "开始训练" }));
    await user.click(screen.getByRole("button", { name: "3 x 3" }));
    await user.click(screen.getByRole("button", { name: "开始本局" }));

    for (const value of ["1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
      await user.click(screen.getByRole("button", { name: value }));
    }

    expect(screen.getByRole("heading", { name: "本局结算" })).toBeInTheDocument();
    expect(screen.getByText(/平均点击间隔/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "查看历史" }));

    expect(screen.getByRole("heading", { name: "历史记录" })).toBeInTheDocument();
    expect(screen.getByText(/3 x 3/)).toBeInTheDocument();
    expect(screen.getByText(/共 1 局/)).toBeInTheDocument();
  });
});
