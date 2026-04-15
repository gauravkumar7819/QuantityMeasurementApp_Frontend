import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import historyService from '../services/historyService';
import HistoryCard from '../components/HistoryCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchHistory = useCallback(async (currentPage = page) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await historyService.getHistory(currentPage, pageSize);
      
      if (result.success) {
        setHistory(result.items || []);
        setTotal(result.total || 0);
        setTotalPages(result.totalPages || 0);
      } else {
        setError(result.error || 'Failed to fetch history');
        setHistory([]);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [pageSize, page]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this history item?')) {
      return;
    }

    try {
      const result = await historyService.deleteHistoryItem(id);
      
      if (result.success) {
        // Refresh the current page
        fetchHistory(page);
      } else {
        setError(result.error || 'Failed to delete item');
      }
    } catch (err) {
      setError('An unexpected error occurred while deleting');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await historyService.clearHistory();
      
      if (result.success) {
        setHistory([]);
        setTotal(0);
        setTotalPages(0);
        setPage(1);
      } else {
        setError(result.error || 'Failed to clear history');
      }
    } catch (err) {
      setError('An unexpected error occurred while clearing history');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleRetry = () => {
    fetchHistory(page);
  };

  if (loading) {
    return <Loader text="Loading history..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Conversion History</h1>
              <p className="text-gray-600">View your past conversions and calculations</p>
            </div>
            {total > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span className="bg-white px-3 py-1 rounded-full border border-gray-200">
              Total: <span className="font-semibold text-gray-900">{total}</span>
            </span>
            <span className="bg-white px-3 py-1 rounded-full border border-gray-200">
              Page: <span className="font-semibold text-gray-900">{page} of {totalPages}</span>
            </span>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-800">{error}</p>
              </div>
              <button
                onClick={handleRetry}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && history.length === 0 && !error && (
          <EmptyState
            icon="📝"
            title="No History Yet"
            message="Start using the converter to build your history"
            action={
              <Link
                to="/converter"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Go to Converter
              </Link>
            }
          />
        )}

        {/* History List */}
        {!loading && history.length > 0 && (
          <>
            <div className="space-y-3 mb-6">
              {history.map((item) => (
                <HistoryCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-gray-700"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors duration-200 ${
                            page === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === page - 2 ||
                      pageNum === page + 2
                    ) {
                      return (
                        <span key={pageNum} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-gray-700"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
