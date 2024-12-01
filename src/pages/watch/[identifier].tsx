import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { GetStaticProps, GetStaticPaths } from "next";
import { getShowById, getAllShowIds } from "@lib/api/tmdb"; // 假设 API 函数从 @lib/api/tmdb 引入
import { useAppSelector } from "@lib/redux";
import { Spinner } from "../../layout/shared/Spinner";
import { checkBrowserCompatibility } from "@lib/browser";
import { fillParent } from "@css/helper";
import { Player } from "../../layout/player/Player";
import { Content } from "@css/helper/content";
import { Meta } from "@lib/meta";

// Styled components
const PlayerWrapper = styled.div``;

const SpinnerWrapper = styled.div`
    position: absolute;
    z-index: 1;
    bottom: 50%;
    left: 50%;
`;

const PlayerIncompatible = styled.div`
    ${fillParent};
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
`;

// Interface for props
interface WatchProps {
    show: Api.TVDetails;
}

const Watch: React.FC<WatchProps> = ({ show }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const waiting = useAppSelector((state) => state.player.waiting);

    const [browserCompatible, setBrowserCompatible] = useState<boolean | null>(null);

    useEffect(() => {
        setBrowserCompatible(checkBrowserCompatibility());
    }, []);

    if (browserCompatible === false)
        return (
            <PlayerIncompatible>
                <Content>
                    Your device/browser seems to be incompatible. Please download our app for the
                    best experience!
                </Content>
            </PlayerIncompatible>
        );

    if (browserCompatible === null)
        return (
            <SpinnerWrapper>
                <Spinner />
            </SpinnerWrapper>
        );

    return (
        <PlayerWrapper ref={containerRef}>
            <Meta title={`${show.name ?? "Watch"} | Stream`} />
            {waiting && (
                <SpinnerWrapper>
                    <Spinner />
                </SpinnerWrapper>
            )}
            <Player show={show} fullscreenContainer={containerRef} />
        </PlayerWrapper>
    );
};

// Static paths generation
export const getStaticPaths: GetStaticPaths = async () => {
    try {
        const ids = await getAllShowIds(); // 获取所有 show IDs
        return {
            paths: ids.map((id) => ({ params: { identifier: id.toString() } })),
            fallback: "blocking", // 支持动态生成
        };
    } catch (error) {
        console.error("Error in getStaticPaths:", error);
        return {
            paths: [],
            fallback: "blocking", // 避免构建失败
        };
    }
};

// Static props generation
export const getStaticProps: GetStaticProps = async (ctx) => {
    try {
        const id = ctx.params?.identifier;

        if (!id || typeof id !== "string") {
            return {
                notFound: true,
            };
        }

        const show = await getShowById(parseInt(id));

        if (!show) {
            return {
                notFound: true,
            };
        }

        return {
            props: {
                show,
            },
            // revalidate: 60, // ISR：每 60 秒重新生成
        };
    } catch (error) {
        console.error("Error in getStaticProps:", error);
        return {
            notFound: true, // 如果 API 请求失败，返回 404 页面
        };
    }
};

export default Watch;