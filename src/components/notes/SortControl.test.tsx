import { render, screen, fireEvent } from "@testing-library/react";
import { SortControl } from "./SortControl";

describe("SortControl", () => {
  const mockOnSortByChange = jest.fn();
  const mockOnSortDirChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render with default value", () => {
    render(
      <SortControl
        sortBy="createdAt"
        sortDir="desc"
        onSortByChange={mockOnSortByChange}
        onSortDirChange={mockOnSortDirChange}
      />
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Created (newest)")).toBeInTheDocument();
  });

  it("should call callbacks when selecting Created (oldest)", () => {
    render(
      <SortControl
        sortBy="createdAt"
        sortDir="desc"
        onSortByChange={mockOnSortByChange}
        onSortDirChange={mockOnSortDirChange}
      />
    );

    const select = screen.getByRole("combobox");
    fireEvent.click(select);

    const option = screen.getByText("Created (oldest)");
    fireEvent.click(option);

    expect(mockOnSortByChange).toHaveBeenCalledWith("createdAt");
    expect(mockOnSortDirChange).toHaveBeenCalledWith("asc");
  });

  it("should call callbacks when selecting Updated (newest)", () => {
    render(
      <SortControl
        sortBy="createdAt"
        sortDir="desc"
        onSortByChange={mockOnSortByChange}
        onSortDirChange={mockOnSortDirChange}
      />
    );

    const select = screen.getByRole("combobox");
    fireEvent.click(select);

    const option = screen.getByText("Updated (newest)");
    fireEvent.click(option);

    expect(mockOnSortByChange).toHaveBeenCalledWith("updatedAt");
    expect(mockOnSortDirChange).toHaveBeenCalledWith("desc");
  });

  it("should call callbacks when selecting Title (A-Z)", () => {
    render(
      <SortControl
        sortBy="createdAt"
        sortDir="desc"
        onSortByChange={mockOnSortByChange}
        onSortDirChange={mockOnSortDirChange}
      />
    );

    const select = screen.getByRole("combobox");
    fireEvent.click(select);

    const option = screen.getByText("Title (A-Z)");
    fireEvent.click(option);

    expect(mockOnSortByChange).toHaveBeenCalledWith("title");
    expect(mockOnSortDirChange).toHaveBeenCalledWith("asc");
  });

  it("should call callbacks when selecting Title (Z-A)", () => {
    render(
      <SortControl
        sortBy="createdAt"
        sortDir="desc"
        onSortByChange={mockOnSortByChange}
        onSortDirChange={mockOnSortDirChange}
      />
    );

    const select = screen.getByRole("combobox");
    fireEvent.click(select);

    const option = screen.getByText("Title (Z-A)");
    fireEvent.click(option);

    expect(mockOnSortByChange).toHaveBeenCalledWith("title");
    expect(mockOnSortDirChange).toHaveBeenCalledWith("desc");
  });

  it("should display correct value for title ascending", () => {
    render(
      <SortControl
        sortBy="title"
        sortDir="asc"
        onSortByChange={mockOnSortByChange}
        onSortDirChange={mockOnSortDirChange}
      />
    );

    expect(screen.getByText("Title (A-Z)")).toBeInTheDocument();
  });

  it("should display correct value for updatedAt descending", () => {
    render(
      <SortControl
        sortBy="updatedAt"
        sortDir="desc"
        onSortByChange={mockOnSortByChange}
        onSortDirChange={mockOnSortDirChange}
      />
    );

    expect(screen.getByText("Updated (newest)")).toBeInTheDocument();
  });
});
