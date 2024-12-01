import React, { useEffect } from "react";
import styled from "styled-components";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { GetStaticProps } from "next";
import { getGenres, getShowById, getTrending } from "@lib/api/tmdb";
import { FEATURED_SHOW } from "@lib/api/tmdb/config";
import { useAppDispatch, useAppSelector } from "@lib/redux";
import { setGenres, fetchGenrePage, resetGenreState } from "@lib/redux/reducer/genre";
import { BasicSlider } from "../layout/shared/BasicSlider/BasicSlider";
import { Spinner } from "../layout/shared/Spinner";
import { Meta } from "@lib/meta";
import { Opener } from "../layout/shared/Opener";
import { TrendingSlider } from "../layout/shared/TrendingSlider/TrendingSlider";
import { useWatchlist } from "@lib/watchlist/context";

const PageWrapper = styled.div`
    padding-bottom: 12rem;
`;

const PageLoading = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const PageBlocks = styled.div<{ $isNegative?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 7.5rem;
    margin-top: -10rem;

    ${p => p.theme.breakpoints.min("l")} {
        gap: 10rem;
    }
`;

interface HomeProps {
    featured: Api.TVDetails;
    trending: Api.TV[];
    genres: Api.Genre[];
}

const Home: React.FC<HomeProps> = ({ featured, trending, genres }) => {
    const dispatch = useAppDispatch();
    const { loading: watchlistLoading, activeShows, keepWatching } = useWatchlist();
    const { genreResults, loading, hasNextPage } = useAppSelector(state => state.genre);

    useEffect(() => {
        // 初始化 genres
        dispatch(resetGenreState());
        dispatch(setGenres(genres));
    }, [dispatch, genres]);

    const [sentryRef] = useInfiniteScroll({
        loading,
        hasNextPage,
        rootMargin: "500px",
        onLoadMore: () => dispatch(fetchGenrePage()),
    });

    return (
        <React.Fragment>
            <Meta title="Home | Stream" />
            {watchlistLoading ? (
                <PageLoading>
                    <Spinner />
                </PageLoading>
            ) : (
                <PageWrapper>
                    {featured && <Opener {...featured} />}
                    <PageBlocks>
                        {activeShows.length > 0 && (
                            <BasicSlider title="Your watchlist" shows={activeShows} />
                        )}
                        {keepWatching.length > 0 && (
                            <BasicSlider title="Keep watching" shows={keepWatching} />
                        )}
                        {trending && <TrendingSlider title="Trending" shows={trending} />}
                        {Object.keys(genreResults).map(showKey => (
                            <BasicSlider
                                key={showKey}
                                title={showKey}
                                shows={genreResults[showKey]}
                            />
                        ))}
                        {(loading || hasNextPage) && <BasicSlider.Skeleton ref={sentryRef} />}
                    </PageBlocks>
                </PageWrapper>
            )}
        </React.Fragment>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const featured = await getShowById(FEATURED_SHOW);
    const trending = await getTrending();
    const genres = await getGenres();

    return {
        props: {
            featured,
            trending,
            genres,
        },
        // revalidate: 60 * 60 * 24, // 24 hours
    };
};

export default Home;