"use client";

import { useState } from "react";
import { Download } from "lucide-react";

export default function ProductBrochureButton({ product }) {
    const [downloading, setDownloading] = useState(false);

    const productName =
        product?.title ||
        product?.name ||
        product?.productName ||
        "Biomedical Equipment";

    const description =
        product?.desc ||
        product?.description ||
        product?.shortDescription ||
        "Advanced biomedical equipment designed for hospitals, laboratories and diagnostic centres.";

    /*
    ---------------------------------------------------------
    GET PRODUCT IMAGE
    ---------------------------------------------------------
    Supports:

    product.images[0]
    product.image
    product.imageUrl
    product.thumbnail
    */

    const getProductImage = () => {
        if (
            Array.isArray(product?.images) &&
            product.images.length > 0
        ) {
            return product.images[0];
        }

        return (
            product?.image ||
            product?.imageUrl ||
            product?.thumbnail ||
            ""
        );
    };

    /*
    ---------------------------------------------------------
    IMAGE -> DATA URL
    ---------------------------------------------------------
    */

    const imageToDataURL = async (url) => {
        if (!url) {
            return "";
        }

        try {
            // First try server proxy to bypass CORS
            const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(url)}`;
            const response = await fetch(proxyUrl, {
                cache: "no-store",
            });

            if (response.ok) {
                const blob = await response.blob();
                if (blob.type && blob.type.startsWith("image/")) {
                    return await blobToCanvasDataURL(blob);
                }
            }
        } catch (error) {
            console.warn("Proxy image loading failed, trying direct load:", error);
        }

        /*
        -----------------------------------------------------
        FALLBACK - DIRECT IMAGE
        -----------------------------------------------------
        */

        try {
            return await new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "anonymous";

                img.onload = () => {
                    try {
                        const canvas = document.createElement("canvas");
                        canvas.width = img.naturalWidth || img.width || 600;
                        canvas.height = img.naturalHeight || img.height || 600;
                        const ctx = canvas.getContext("2d");
                        ctx.fillStyle = "#ffffff";
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0);
                        resolve(canvas.toDataURL("image/jpeg", 0.95));
                    } catch (error) {
                        reject(error);
                    }
                };

                img.onerror = () => {
                    reject(new Error("Direct image loading failed"));
                };

                img.src = url;
            });
        } catch (error) {
            console.error("Product image conversion failed:", error);
            return "";
        }
    };

    const blobToCanvasDataURL = (blob) => {
        return new Promise((resolve, reject) => {
            const objectUrl = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
                try {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.naturalWidth || img.width || 600;
                    canvas.height = img.naturalHeight || img.height || 600;
                    const ctx = canvas.getContext("2d");
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                    URL.revokeObjectURL(objectUrl);
                    resolve(canvas.toDataURL("image/jpeg", 0.95));
                } catch (err) {
                    URL.revokeObjectURL(objectUrl);
                    reject(err);
                }
            };
            img.onerror = (err) => {
                URL.revokeObjectURL(objectUrl);
                reject(err);
            };
            img.src = objectUrl;
        });
    };

    /*
    ---------------------------------------------------------
    IMAGE DIMENSIONS
    ---------------------------------------------------------
    */

    const getImageDimensions = (
        dataUrl
    ) => {
        return new Promise(
            (resolve, reject) => {
                const img =
                    new Image();

                img.onload = () => {
                    resolve({
                        width:
                            img.naturalWidth ||
                            img.width,
                        height:
                            img.naturalHeight ||
                            img.height,
                    });
                };

                img.onerror =
                    reject;

                img.src =
                    dataUrl;
            }
        );
    };

    /*
    ---------------------------------------------------------
    IMAGE FORMAT
    ---------------------------------------------------------
    */

    const getImageFormat = (
        dataUrl
    ) => {
        if (
            dataUrl?.includes(
                "image/png"
            )
        ) {
            return "PNG";
        }

        return "JPEG";
    };

    /*
    ---------------------------------------------------------
    HANDLE PDF DOWNLOAD
    ---------------------------------------------------------
    */

    const handleDownload = async (
        e
    ) => {
        e.preventDefault();
        e.stopPropagation();

        if (
            downloading ||
            !product
        ) {
            return;
        }

        try {
            setDownloading(true);

            const { jsPDF } =
                await import(
                    "jspdf"
                );

            /*
            -------------------------------------------------
            LOAD PRODUCT IMAGE
            -------------------------------------------------
            */

            const imageUrl =
                getProductImage();

            let imageData = "";

            if (imageUrl) {
                imageData =
                    await imageToDataURL(
                        imageUrl
                    );
            }

            console.log(
                "BROCHURE IMAGE URL:",
                imageUrl
            );

            console.log(
                "BROCHURE IMAGE LOADED:",
                !!imageData
            );

            /*
            -------------------------------------------------
            PDF
            -------------------------------------------------
            */

            const pdf =
                new jsPDF({
                    orientation:
                        "portrait",
                    unit: "mm",
                    format: "a4",
                    compress: true,
                });

            const PAGE_WIDTH =
                210;

            const PAGE_HEIGHT =
                297;

            const MARGIN =
                15;

            const CONTENT_WIDTH =
                PAGE_WIDTH -
                MARGIN * 2;

            /*
            -------------------------------------------------
            COLORS
            -------------------------------------------------
            */

            const PRIMARY = [
                2,
                132,
                199,
            ];

            const DARK = [
                15,
                23,
                42,
            ];

            const MUTED = [
                100,
                116,
                139,
            ];

            const BORDER = [
                226,
                232,
                240,
            ];

            const LIGHT = [
                248,
                250,
                252,
            ];

            /*
            -------------------------------------------------
            HEADER
            -------------------------------------------------
            */

            let y = 16;

            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.setFontSize(19);

            pdf.setTextColor(
                ...DARK
            );

            pdf.text(
                "Rajbiosis Private Limited",
                MARGIN,
                y
            );

            pdf.setFontSize(7);

            pdf.setTextColor(
                ...PRIMARY
            );

            pdf.text(
                "BIOMEDICAL & HEALTHCARE SOLUTIONS",
                MARGIN,
                y + 7
            );

            pdf.setFontSize(8);

            pdf.text(
                "PRODUCT BROCHURE",
                PAGE_WIDTH -
                    MARGIN,
                y,
                {
                    align: "right",
                }
            );

            pdf.setFont(
                "helvetica",
                "normal"
            );

            pdf.setFontSize(7);

            pdf.setTextColor(
                ...MUTED
            );

            pdf.text(
                "ozalle.com",
                PAGE_WIDTH -
                    MARGIN,
                y + 7,
                {
                    align: "right",
                }
            );

            y += 13;

            pdf.setDrawColor(
                ...PRIMARY
            );

            pdf.setLineWidth(
                0.8
            );

            pdf.line(
                MARGIN,
                y,
                PAGE_WIDTH -
                    MARGIN,
                y
            );

            y += 13;

            /*
            -------------------------------------------------
            PRODUCT BADGE
            -------------------------------------------------
            */

            pdf.setFillColor(
                239,
                246,
                255
            );

            pdf.roundedRect(
                MARGIN,
                y - 5,
                42,
                8,
                4,
                4,
                "F"
            );

            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.setFontSize(7);

            pdf.setTextColor(
                ...PRIMARY
            );

            pdf.text(
                "PRODUCT BROCHURE",
                MARGIN + 5,
                y
            );

            y += 12;

            /*
            -------------------------------------------------
            TITLE
            -------------------------------------------------
            */

            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.setFontSize(18);

            pdf.setTextColor(
                ...DARK
            );

            const titleLines =
                pdf.splitTextToSize(
                    productName,
                    CONTENT_WIDTH
                );

            pdf.text(
                titleLines,
                MARGIN,
                y
            );

            y +=
                titleLines.length *
                    7 +
                7;

            /*
            -------------------------------------------------
            IMAGE + DETAILS
            -------------------------------------------------
            */

            const imageX =
                MARGIN;

            const imageY =
                y;

            const imageWidth =
                100;

            const imageHeight =
                78;

            const detailsX =
                imageX +
                imageWidth +
                7;

            const detailsWidth =
                PAGE_WIDTH -
                MARGIN -
                detailsX;

            /*
            IMAGE BOX
            */

            pdf.setFillColor(
                ...LIGHT
            );

            pdf.setDrawColor(
                ...BORDER
            );

            pdf.roundedRect(
                imageX,
                imageY,
                imageWidth,
                imageHeight,
                6,
                6,
                "FD"
            );

            /*
            ACTUAL PRODUCT IMAGE
            */

            if (imageData) {
                try {
                    const dimensions =
                        await getImageDimensions(
                            imageData
                        );

                    const format =
                        getImageFormat(
                            imageData
                        );

                    const padding =
                        7;

                    const maxWidth =
                        imageWidth -
                        padding * 2;

                    const maxHeight =
                        imageHeight -
                        padding * 2;

                    const ratio =
                        Math.min(
                            maxWidth /
                                dimensions.width,
                            maxHeight /
                                dimensions.height
                        );

                    const drawWidth =
                        dimensions.width *
                        ratio;

                    const drawHeight =
                        dimensions.height *
                        ratio;

                    const drawX =
                        imageX +
                        (
                            imageWidth -
                            drawWidth
                        ) /
                            2;

                    const drawY =
                        imageY +
                        (
                            imageHeight -
                            drawHeight
                        ) /
                            2;

                    pdf.addImage(
                        imageData,
                        format,
                        drawX,
                        drawY,
                        drawWidth,
                        drawHeight,
                        undefined,
                        "MEDIUM"
                    );
                } catch (error) {
                    console.error(
                        "PDF image error:",
                        error
                    );

                    drawPlaceholder(
                        pdf,
                        imageX,
                        imageY,
                        imageWidth,
                        imageHeight,
                        MUTED
                    );
                }
            } else {
                drawPlaceholder(
                    pdf,
                    imageX,
                    imageY,
                    imageWidth,
                    imageHeight,
                    MUTED
                );
            }

            /*
            -------------------------------------------------
            DETAILS CARD
            -------------------------------------------------
            */

            pdf.setFillColor(
                255,
                255,
                255
            );

            pdf.setDrawColor(
                ...BORDER
            );

            pdf.roundedRect(
                detailsX,
                imageY,
                detailsWidth,
                imageHeight,
                6,
                6,
                "FD"
            );

            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.setFontSize(11);

            pdf.setTextColor(
                ...PRIMARY
            );

            pdf.text(
                "Product Details",
                detailsX + 6,
                imageY + 11
            );

            pdf.setDrawColor(
                ...BORDER
            );

            pdf.line(
                detailsX + 6,
                imageY + 16,
                detailsX +
                    detailsWidth -
                    6,
                imageY + 16
            );

            const details = [
                [
                    "Brand",
                    product?.brand,
                ],
                [
                    "Model",
                    product?.model,
                ],
                [
                    "Instrument",
                    product?.instrument,
                ],
                [
                    "Category",
                    product?.category,
                ],
                [
                    "Capacity",
                    product?.capacity,
                ],
                [
                    "Throughput",
                    product?.throughput,
                ],
                [
                    "Automation",
                    product?.automation,
                ],
                [
                    "Usage",
                    product?.usage,
                ],
            ].filter(
                ([, value]) =>
                    value !==
                        undefined &&
                    value !==
                        null &&
                    String(
                        value
                    ).trim() !== ""
            );

            let detailY =
                imageY + 25;

            details.forEach(
                ([label, value]) => {
                    if (
                        detailY >
                        imageY +
                            imageHeight -
                            5
                    ) {
                        return;
                    }

                    pdf.setFont(
                        "helvetica",
                        "bold"
                    );

                    pdf.setFontSize(
                        7
                    );

                    pdf.setTextColor(
                        ...DARK
                    );

                    pdf.text(
                        `${label}:`,
                        detailsX + 6,
                        detailY
                    );

                    pdf.setFont(
                        "helvetica",
                        "normal"
                    );

                    pdf.setTextColor(
                        ...MUTED
                    );

                    const lines =
                        pdf.splitTextToSize(
                            String(
                                value
                            ),
                            detailsWidth -
                                37
                        );

                    pdf.text(
                        lines,
                        detailsX + 29,
                        detailY
                    );

                    detailY +=
                        Math.max(
                            5,
                            lines.length *
                                3.8
                        );
                }
            );

            y =
                imageY +
                imageHeight +
                12;

            /*
            -------------------------------------------------
            OVERVIEW
            -------------------------------------------------
            */

            drawSectionTitle(
                pdf,
                "Product Overview",
                MARGIN,
                y,
                PRIMARY,
                DARK
            );

            y += 9;

            pdf.setFont(
                "helvetica",
                "normal"
            );

            pdf.setFontSize(8.5);

            pdf.setTextColor(
                ...MUTED
            );

            const overview =
                pdf.splitTextToSize(
                    description,
                    CONTENT_WIDTH
                );

            pdf.text(
                overview,
                MARGIN,
                y
            );

            y +=
                overview.length *
                    4.5 +
                9;

            /*
            -------------------------------------------------
            TECHNICAL SPECIFICATIONS
            -------------------------------------------------
            */

            const specifications = [
                [
                    "Brand",
                    product?.brand,
                ],
                [
                    "Model",
                    product?.model,
                ],
                [
                    "Instrument",
                    product?.instrument,
                ],
                [
                    "Category",
                    product?.category,
                ],
                [
                    "Subcategory",
                    product?.subCategory ||
                        product?.subcategory,
                ],
                [
                    "Capacity",
                    product?.capacity,
                ],
                [
                    "Throughput",
                    product?.throughput,
                ],
                [
                    "Usage",
                    product?.usage,
                ],
                [
                    "Automation",
                    product?.automation,
                ],
                [
                    "Availability",
                    product?.availability,
                ],
            ].filter(
                ([, value]) =>
                    value !==
                        undefined &&
                    value !==
                        null &&
                    String(
                        value
                    ).trim() !== ""
            );

            if (
                specifications.length
            ) {
                drawSectionTitle(
                    pdf,
                    "Technical Specifications",
                    MARGIN,
                    y,
                    PRIMARY,
                    DARK
                );

                y += 8;

                const labelWidth =
                    52;

                specifications.forEach(
                    (
                        [label, value],
                        index
                    ) => {
                        const valueLines =
                            pdf.splitTextToSize(
                                String(
                                    value
                                ),
                                CONTENT_WIDTH -
                                    labelWidth -
                                    8
                            );

                        const rowHeight =
                            Math.max(
                                8,
                                valueLines.length *
                                    4 +
                                    3
                            );

                        if (
                            y +
                                rowHeight >
                            270
                        ) {
                            addFooter(
                                pdf,
                                PAGE_WIDTH,
                                PAGE_HEIGHT,
                                MARGIN,
                                PRIMARY,
                                MUTED
                            );

                            pdf.addPage();

                            y = 20;

                            drawSectionTitle(
                                pdf,
                                "Technical Specifications",
                                MARGIN,
                                y,
                                PRIMARY,
                                DARK
                            );

                            y += 8;
                        }

                        if (
                            index % 2 ===
                            0
                        ) {
                            pdf.setFillColor(
                                248,
                                250,
                                252
                            );

                            pdf.rect(
                                MARGIN,
                                y - 5,
                                CONTENT_WIDTH,
                                rowHeight,
                                "F"
                            );
                        }

                        pdf.setFont(
                            "helvetica",
                            "bold"
                        );

                        pdf.setFontSize(
                            7.5
                        );

                        pdf.setTextColor(
                            ...DARK
                        );

                        pdf.text(
                            label,
                            MARGIN + 4,
                            y
                        );

                        pdf.setFont(
                            "helvetica",
                            "normal"
                        );

                        pdf.setTextColor(
                            ...MUTED
                        );

                        pdf.text(
                            valueLines,
                            MARGIN +
                                labelWidth,
                            y
                        );

                        y +=
                            rowHeight;
                    }
                );

                y += 8;
            }

            /*
            -------------------------------------------------
            FEATURES
            -------------------------------------------------
            */

            const features =
                Array.isArray(
                    product?.features
                )
                    ? product.features
                    : [];

            if (
                features.length
            ) {
                if (
                    y > 230
                ) {
                    addFooter(
                        pdf,
                        PAGE_WIDTH,
                        PAGE_HEIGHT,
                        MARGIN,
                        PRIMARY,
                        MUTED
                    );

                    pdf.addPage();

                    y = 20;
                }

                drawSectionTitle(
                    pdf,
                    "Key Features",
                    MARGIN,
                    y,
                    PRIMARY,
                    DARK
                );

                y += 9;

                features
                    .slice(0, 10)
                    .forEach(
                        (feature) => {
                            const text =
                                getFeatureText(
                                    feature
                                );

                            if (
                                !text
                            )
                                return;

                            const lines =
                                pdf.splitTextToSize(
                                    text,
                                    CONTENT_WIDTH -
                                        10
                                );

                            pdf.setFont(
                                "helvetica",
                                "normal"
                            );

                            pdf.setFontSize(
                                8
                            );

                            pdf.setTextColor(
                                ...MUTED
                            );

                            pdf.setTextColor(
                                ...PRIMARY
                            );

                            pdf.text(
                                "✓",
                                MARGIN,
                                y
                            );

                            pdf.setTextColor(
                                ...MUTED
                            );

                            pdf.text(
                                lines,
                                MARGIN +
                                    5,
                                y
                            );

                            y +=
                                Math.max(
                                    6,
                                    lines.length *
                                        4.5
                                );
                        }
                    );

                y += 5;
            }

            /*
            -------------------------------------------------
            APPLICATIONS
            -------------------------------------------------
            */

            const applications =
                product?.applications ||
                product?.application ||
                "";

            if (
                applications
            ) {
                if (
                    y > 230
                ) {
                    addFooter(
                        pdf,
                        PAGE_WIDTH,
                        PAGE_HEIGHT,
                        MARGIN,
                        PRIMARY,
                        MUTED
                    );

                    pdf.addPage();

                    y = 20;
                }

                drawSectionTitle(
                    pdf,
                    "Applications",
                    MARGIN,
                    y,
                    PRIMARY,
                    DARK
                );

                y += 9;

                pdf.setFont(
                    "helvetica",
                    "normal"
                );

                pdf.setFontSize(
                    8.5
                );

                pdf.setTextColor(
                    ...MUTED
                );

                const applicationLines =
                    pdf.splitTextToSize(
                        String(
                            applications
                        ),
                        CONTENT_WIDTH
                    );

                pdf.text(
                    applicationLines,
                    MARGIN,
                    y
                );
            }

            /*
            -------------------------------------------------
            CTA
            -------------------------------------------------
            */

            y = Math.max(
                y + 12,
                230
            );

            if (
                y + 31 >
                270
            ) {
                addFooter(
                    pdf,
                    PAGE_WIDTH,
                    PAGE_HEIGHT,
                    MARGIN,
                    PRIMARY,
                    MUTED
                );

                pdf.addPage();

                y = 220;
            }

            pdf.setFillColor(
                239,
                246,
                255
            );

            pdf.setDrawColor(
                219,
                234,
                254
            );

            pdf.roundedRect(
                MARGIN,
                y,
                CONTENT_WIDTH,
                31,
                6,
                6,
                "FD"
            );

            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.setFontSize(
                11
            );

            pdf.setTextColor(
                ...DARK
            );

            pdf.text(
                "Need More Information?",
                MARGIN + 7,
                y + 10
            );

            pdf.setFont(
                "helvetica",
                "normal"
            );

            pdf.setFontSize(
                7.5
            );

            pdf.setTextColor(
                ...MUTED
            );

            pdf.text(
                "Contact Rajbiosis Private Limited for product specifications, pricing, installation and technical support.",
                MARGIN + 7,
                y + 17
            );

            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.setFontSize(
                7
            );

            pdf.setTextColor(
                ...PRIMARY
            );

            pdf.text(
                "ozalle.com",
                MARGIN + 7,
                y + 26
            );

            /*
            -------------------------------------------------
            FOOTER
            -------------------------------------------------
            */

            addFooter(
                pdf,
                PAGE_WIDTH,
                PAGE_HEIGHT,
                MARGIN,
                PRIMARY,
                MUTED
            );

            /*
            -------------------------------------------------
            FILE NAME
            -------------------------------------------------
            */

            const safeName =
                productName
                    .replace(
                        /[^a-zA-Z0-9\s-_]/g,
                        ""
                    )
                    .trim()
                    .replace(
                        /\s+/g,
                        "_"
                    )
                    .substring(
                        0,
                        100
                    );

            pdf.save(
                `Ozalle_${safeName}_Brochure.pdf`
            );
        } catch (error) {
            console.error(
                "BROCHURE ERROR:",
                error
            );

            alert(
                "Unable to generate brochure. Please try again."
            );
        } finally {
            setDownloading(
                false
            );
        }
    };

    return (
        <button
            type="button"
            onClick={
                handleDownload
            }
            disabled={
                downloading
            }
            className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-sky-600
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                shadow-lg
                shadow-sky-600/20
                transition
                hover:bg-sky-700
                disabled:cursor-not-allowed
                disabled:opacity-60
            "
        >
            {downloading ? (
                <>
                    <span
                        className="
                            h-4
                            w-4
                            animate-spin
                            rounded-full
                            border-2
                            border-white/40
                            border-t-white
                        "
                    />

                    Generating...
                </>
            ) : (
                <>
                    <Download
                        size={17}
                    />

                    Download Brochure
                </>
            )}
        </button>
    );
}

/*
=========================================================
HELPERS
=========================================================
*/

function getFeatureText(
    feature
) {
    if (!feature) {
        return "";
    }

    if (
        typeof feature ===
        "string"
    ) {
        return feature;
    }

    return (
        feature?.name ||
        feature?.title ||
        feature?.description ||
        ""
    );
}

function drawPlaceholder(
    pdf,
    x,
    y,
    width,
    height,
    muted
) {
    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(8);

    pdf.setTextColor(
        ...muted
    );

    pdf.text(
        "PRODUCT IMAGE",
        x +
            width / 2,
        y +
            height / 2,
        {
            align: "center",
        }
    );
}

function drawSectionTitle(
    pdf,
    title,
    x,
    y,
    primary,
    dark
) {
    pdf.setFillColor(
        ...primary
    );

    pdf.roundedRect(
        x,
        y - 5.5,
        1.7,
        7,
        0.8,
        0.8,
        "F"
    );

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(
        11.5
    );

    pdf.setTextColor(
        ...dark
    );

    pdf.text(
        title,
        x + 6,
        y
    );
}

function addFooter(
    pdf,
    pageWidth,
    pageHeight,
    margin,
    primary,
    muted
) {
    const footerY =
        pageHeight - 10;

    pdf.setDrawColor(
        226,
        232,
        240
    );

    pdf.setLineWidth(
        0.3
    );

    pdf.line(
        margin,
        footerY - 7,
        pageWidth -
            margin,
        footerY - 7
    );

    pdf.setFont(
        "helvetica",
        "bold"
    );

    pdf.setFontSize(
        6.5
    );

    pdf.setTextColor(
        ...primary
    );

    pdf.text(
        "RAJBIOSIS PRIVATE LIMITED",
        pageWidth / 2,
        footerY - 2,
        {
            align: "center",
        }
    );

    pdf.setFont(
        "helvetica",
        "normal"
    );

    pdf.setFontSize(
        6
    );

    pdf.setTextColor(
        ...muted
    );

    pdf.text(
        "Biomedical Equipment & Healthcare Solutions",
        pageWidth / 2,
        footerY + 2,
        {
            align: "center",
        }
    );

    pdf.text(
        "ozalle.com",
        pageWidth / 2,
        footerY + 6,
        {
            align: "center",
        }
    );
}