import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function usePagination(fetchAction, updateUrl = true) {
  const location = useLocation();
  const navigate = useNavigate();

  const [paginationConfig, setPaginationConfig] = useState({page: 1, limit: 10, term: '', sortField: 'createdAt', sortOrder: 'desc', filters: {}});
  const query = new URLSearchParams(location.search);
  const queryParams = [
    'page',
    'limit',
    'term',
    'sortField',
    'sortOrder',
    'filters'
  ]

  useEffect(() => {
    updateUrl && checkParams();
  }, []);

  function checkParams() {
    const urlOptions = {};

    for(const param of queryParams) {
      if (query.has(param)) {
        const value = query.get(param).trim();
        
        if (value && value !== '') {
          urlOptions[param] = value;
          if ((param === 'limit' || param === 'page') && !isNaN(value)) urlOptions[param] = parseInt(value);
          if (param === 'filters') urlOptions[param] = JSON.parse(value);
        }
        
      }
    }

    setPaginationOptions(urlOptions);
  }

  function updateQueryParams(config = paginationConfig) {
    const { page, limit, term, sortField, sortOrder, filters } = config;
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", page);
    queryParams.set("limit", limit);
    queryParams.set("term", term);
    queryParams.set("sortField", sortField);
    queryParams.set("sortOrder", sortOrder);
    queryParams.set("filters", JSON.stringify(filters));
    navigate(`?${queryParams.toString()}`);
  }

  function setPaginationOptions(options) {
    const newOptions = {
      ...paginationConfig,
      ...options
    };
    setPaginationConfig(newOptions);
    updateUrl && updateQueryParams(newOptions);

    return newOptions;
  }

  function next() {
    const newConfig = setPaginationOptions({page: paginationConfig.page + 1});
    run(newConfig);
  }

  function prev() {
    const newConfig = setPaginationOptions({page: paginationConfig.page + 1});
    run(newConfig);
  }

  function jump(page) {
    const newConfig = setPaginationOptions({page});
    run(newConfig);
  }

  function sort({ sortField, sortOrder }) {
    const newConfig = setPaginationOptions({page: 1, sortField, sortOrder});
    run(newConfig);
  }

  function toLimit(limit) {
    const newConfig = setPaginationOptions({page: 1, limit});
    run(newConfig);
  }

  function search(term) {
    const newConfig = setPaginationOptions({page: 1, term});
    run(newConfig);
  }

  function run(config = paginationConfig) {
    fetchAction(config);
  }

  return { next, prev, jump, sort, toLimit, search, run, paginationConfig, setPaginationOptions };
}

export default usePagination;
