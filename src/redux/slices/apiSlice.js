import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  GET_AREAS_API_URL,
  POST_AREAS_API_URL,
  DELETE_AREAS_API_URL,
  UPDATE_COMPLETED_TASKS_URL,
  GET_TASKS_API_URL,
  POST_TASKS_API_URL,
  UPDATE_TASK_API_URL,
} from "../../utils/apiUrl";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
} from "../../utils/requestMethods";

const getItemsFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async (userId) => {
    // console.log(apiURL, userId);
    const fullPath = `${apiURL}/${userId}`;
    return await getRequest(fullPath);
  });
};

const getTasksFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async (userId) => {
    // console.log(apiURL, userId);
    const fullPath = `${apiURL}/${userId}`;
    return await getRequest(fullPath);
  });
};

const postItemFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async (postData) => {
    // console.log(postData);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData), // 표준 json 문자열로 변환
    };
    return await postRequest(apiURL, options);
  });
};

const postTaskFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async (postData) => {
    // console.log(postData);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData), // 표준 json 문자열로 변환
    };
    return await postRequest(apiURL, options);
  });
};

const deleteItemFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async (id) => {
    // console.log(postData);
    const options = {
      method: "DELETE",
    };
    const fullPath = `${apiURL}/${id}`;
    await deleteRequest(fullPath, options);
    return id;
  });
};

const deleteTaskFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async (id) => {
    // console.log(postData);
    const options = {
      method: "DELETE",
    };
    const fullPath = `${apiURL}/${id}`;
    await deleteRequest(fullPath, options);
    return id;
  });
};

const updateTaskFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async (updateData) => {
    // console.log(options);
    const options = {
      body: JSON.stringify(updateData),
    };
    return await patchRequest(apiURL, options);
  });
};

const updateCompletedFetchThunk = (actionType, apiURL) => {
  return createAsyncThunk(actionType, async (options) => {
    // console.log(options);
    return await patchRequest(apiURL, options);
  });
};

export const fetchGetItemsData = getItemsFetchThunk(
  "fetchGetItems",
  GET_AREAS_API_URL
);

export const fetchGetTasksData = getTasksFetchThunk(
  "fetchGetTasks",
  GET_TASKS_API_URL
);

export const fetchPostItemData = postItemFetchThunk(
  "fetchPostItem",
  POST_AREAS_API_URL
);

export const fetchPostTaskData = postTaskFetchThunk(
  "fetchPostTask",
  POST_TASKS_API_URL
);

export const fetchDeleteItemData = deleteItemFetchThunk(
  "fetchDeleteItem",
  DELETE_AREAS_API_URL
);

export const fetchDeleteTaskData = deleteTaskFetchThunk(
  "fetchDeleteTask",
  DELETE_AREAS_API_URL
);

export const fetchPutTaskData = updateTaskFetchThunk(
  "fetchPutTask",
  UPDATE_TASK_API_URL
);

export const fetchUpdateCompletedData = updateCompletedFetchThunk(
  "fetchUpdateCompleted",
  UPDATE_COMPLETED_TASKS_URL
);

const handleFullfilled = (stateKey) => (state, action) => {
  state[stateKey] = action.payload;
};

const handleRejected = (state, action) => {
  console.log(action.payload);
  state.isError = true;
};

const apiSlice = createSlice({
  name: "api",
  initialState: {
    getItemData: [],
    postItemData: null,
    deleteItemData: null,
    getTasksData: [],
    postTasksData: null,
    deleteTaskData: null,
    updateCompletedData: null,
    updatePutData: null,
    isError: false,
  },
  extraReducers: (builder) => {
    builder
      // 캠핑장 apiSlice
      .addCase(fetchGetItemsData.fulfilled, handleFullfilled("getItemsData"))
      .addCase(fetchGetItemsData.rejected, handleRejected)
      .addCase(fetchPostItemData.fulfilled, handleFullfilled("postItemData"))
      .addCase(fetchPostItemData.rejected, handleRejected)
      .addCase(
        fetchDeleteItemData.fulfilled,
        handleFullfilled("deleteItemData")
      )
      .addCase(fetchDeleteItemData.rejected, handleRejected)
      //  리뷰 apiSlice
      .addCase(fetchGetTasksData.fulfilled, handleFullfilled("getTasksData"))
      .addCase(fetchGetTasksData.rejected, handleRejected)
      .addCase(fetchPostTaskData.fulfilled, handleFullfilled("postTaskData"))
      .addCase(fetchPostTaskData.rejected, handleRejected)
      .addCase(
        fetchDeleteTaskData.fulfilled,
        handleFullfilled("deleteTaskData")
      )
      .addCase(fetchDeleteTaskData.rejected, handleRejected)
      .addCase(
        fetchUpdateCompletedData.fulfilled,
        handleFullfilled("updateCompletedData")
      )
      .addCase(fetchUpdateCompletedData.rejected, handleRejected)
      .addCase(fetchPutTaskData.fulfilled, handleFullfilled("updatePutData"))
      .addCase(fetchPutTaskData.rejected, handleRejected);
  },
});

export default apiSlice.reducer;
