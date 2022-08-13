import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SummaryForm from "../SummaryForm";

test("체크박스와 버튼이 화면에 보여진다.", () => {
  render(<SummaryForm />);

  // 체크박스는 비활성화 된 상태이다.
  const checkbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  expect(checkbox).not.toBeChecked();

  // 버튼은 비활성화 상태이다.
  const confirmButton = screen.getByRole("button", { name: /confirm order/i });
  expect(confirmButton).toBeDisabled();
});

test("체크박스를 클릭하면 버튼이 활성화/비활성화 된다.", () => {
  render(<SummaryForm />);

  const checkbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });

  const confirmButton = screen.getByRole("button", {
    name: /confirm order/i,
  });

  // 체크박스를 클릭하면, 활성화된다.
  userEvent.click(checkbox);
  expect(confirmButton).toBeEnabled();

  // 체크박스를 클릭하면, 비활성화된다.
  userEvent.click(checkbox);
  expect(confirmButton).toBeDisabled();
});

test("popover UI가 제대로 동작한다.", async () => {
  render(<SummaryForm />);

  // 처음에 팝오버가 나타나지 않는다.
  const nullPopover = screen.queryByText(
    /no ice cream will actually be delivered/i
  );
  expect(nullPopover).not.toBeInTheDocument();

  // 체크박스 라벨에 커서가 올라가면 동작하는지 확인한다.
  const termsAndConditions = screen.getByText(/terms and conditions/i);
  userEvent.hover(termsAndConditions);

  // 팝오버가 나타났는지 확인한다.
  const popover = screen.getByText(/no ice cream will actually be delivered/i);
  expect(popover).toBeInTheDocument();

  // 커서를 밖으로 움직이면 다시 사라진다.
  userEvent.unhover(termsAndConditions);
  await waitForElementToBeRemoved(() =>
    screen.queryByText(/no ice cream will actually be delivered/i)
  );

  /* 팝오버가 사라지는 동작이 비동기적으로 일어나고 있었기 때문에 밑에 코드가 에러가 발생한 것! 
     즉, 테스트 힘수가 완료되고 나서야 동작이 일어난 것이며, 테스트가 종료된 후에 무언가가 일어나고 있었기 때문에 에러가 발생함.
  */
  //   expect(nullPopoverAgain).not.toBeInTheDocument();
});
