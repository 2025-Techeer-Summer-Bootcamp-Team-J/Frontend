import type { SkinTypeAnalysisResponse } from '../services/types';

// 피부 관리 팁 상수
export const skinCareTips = [
    "지성 피부는 오일프리(Oil-Free) 제품을 사용하는 것이 번들거림을 줄이는 데 도움이 됩니다.",
    "건성 피부는 세라마이드, 히알루론산 성분이 포함된 보습제를 사용하면 피부 장벽 강화에 좋습니다.",
    "자외선 차단제는 비가 오거나 흐린 날에도 매일 바르는 것이 피부 노화 방지의 핵심입니다.",
    "복합성 피부는 T존은 지성, U존은 건성의 특징을 보이는 가장 흔한 피부 타입입니다.",
    "민감성 피부는 새로운 화장품 사용 전, 귀 뒤나 팔 안쪽에 패치 테스트를 하는 것이 안전합니다.",
    "클렌징은 하루 2번, 아침과 저녁에 하는 것이 가장 이상적입니다. 과도한 세안은 피부를 건조하게 만들 수 있어요.",
    "미지근한 물로 세안하는 것이 피부 자극을 최소화하고 유수분 밸런스를 지키는 데 도움이 됩니다."
];

// 피부 결과 타입 정의
export interface SkinResult {
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    care: string[];
}

// API 응답을 SkinResult로 변환하는 함수
export const convertApiResponseToSkinResult = (response: SkinTypeAnalysisResponse): SkinResult => {
    const skinTypeInfo = {
        1: {
            name: "지성 피부",
            description: "유분 분비가 활발하여 번들거림이 있지만 수분 보유력이 좋은 피부 타입입니다.",
            characteristics: ["T존 유분 과다", "모공이 뚜렷함", "여드름 발생 가능성 높음", "화장이 잘 지워짐"],
            care: ["유분 조절 토너 사용", "주 2-3회 딥클렌징", "수분 크림보다 젤 타입 제품 사용", "자외선 차단제 필수"]
        },
        2: {
            name: "중성 피부",
            description: "유분과 수분의 균형이 잘 맞는 이상적인 피부 타입으로, 트러블이 적고 탄력이 좋습니다.",
            characteristics: ["적당한 유분과 수분", "모공이 작고 깔끔함", "트러블이 적음", "탄력이 좋음"],
            care: ["기본적인 세안과 보습", "주 1-2회 각질 제거", "계절에 맞는 보습 제품 사용", "꾸준한 자외선 차단"]
        },
        3: {
            name: "건성 피부",
            description: "유분과 수분이 부족하여 당김과 각질이 생기기 쉬운 피부 타입입니다.",
            characteristics: ["피부 당김 현상", "각질 발생", "모공이 작음", "주름 생기기 쉬움"],
            care: ["풍부한 보습 크림 사용", "각질 제거는 주 1회", "오일 제품 활용", "수분 공급 집중 관리"]
        },
        4: {
            name: "복합성 피부",
            description: "T존은 지성, U존은 건성의 특징을 보이는 가장 흔한 피부 타입입니다.",
            characteristics: ["T존 유분 과다", "U존 건조함", "부위별 다른 관리 필요", "계절 변화에 민감"],
            care: ["부위별 맞춤 관리", "T존은 유분 조절, U존은 보습", "순한 세안제 사용", "부분별 다른 제품 사용"]
        },
        5: {
            name: "민감성 피부",
            description: "외부 자극에 쉽게 반응하여 붉어지거나 트러블이 생기기 쉬운 피부 타입입니다.",
            characteristics: ["쉽게 붉어짐", "자극에 민감", "알레르기 반응 가능", "얇고 예민한 피부"],
            care: ["무향, 무색소 제품 사용", "패치 테스트 필수", "순한 세안제 사용", "자극적인 성분 피하기"]
        }
    };

    const skinTypeCode = response.data.skin_type_code;
    const defaultInfo = skinTypeInfo[skinTypeCode as keyof typeof skinTypeInfo] || {
        name: response.data.skin_type_name,
        description: `${response.data.skin_type_name}으로 분석되었습니다.`,
        characteristics: ["개인별 특성에 따라 다를 수 있습니다."],
        care: ["전문가와 상담하여 맞춤 관리를 받으시기 바랍니다."]
    };

    return {
        title: defaultInfo.name,
        subtitle: response.data.skin_type_name,
        description: defaultInfo.description,
        features: defaultInfo.characteristics,
        care: defaultInfo.care
    };
}; 