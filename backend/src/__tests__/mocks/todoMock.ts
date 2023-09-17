import { iTodo } from "./../../interfaces/todo.interface";
const currentDate = new Date();

export const todoMocks = {
  todoInvalidMock: {},

  todoMock01: {
    title: "Todo test 01",
    description: "This a todo of test 01",
    complete: false,
    created_at: currentDate.toISOString(),
    dateCompleted: null,
  } as Omit<iTodo, "id">,

  todoMock02: {
    title: "Todo test 02",
    description: "This a todo of test 02",
    complete: true,
    dateCompleted: currentDate.toISOString(),
    created_at: currentDate.toISOString(),
  } as Omit<iTodo, "id">,

  todoUpdateMock: {
    title: "Todo test updated",
    description: "This a todo of test updated",
  },
};
