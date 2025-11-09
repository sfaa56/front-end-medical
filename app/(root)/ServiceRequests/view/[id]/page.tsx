"use client";
import Link from "next/link";
import { FiUpload, FiX } from "react-icons/fi";
import React, { useRef, useState, useEffect } from "react";
import { FiChevronRight } from "react-icons/fi";
import { FaBriefcase } from "react-icons/fa";
import { FiTrash2, FiMessageCircle } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { apiClient } from "@/lib/api";

export default function Page() {
  const { id } = useParams();
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isEditingAttachments, setIsEditingAttachments] = useState(false);
  const [isEditingRequirements, setIsEditingRequirements] = useState(false);

  const [editAttachments, setEditAttachments] = useState<any[]>([]);
  const [editInfo, setEditInfo] = useState<any>({});
  const [editDetails, setEditDetails] = useState<any>({});
  const [editRequirements,setEditRequirements]=useState<any>([]);
   const [newRequirement, setNewRequirement] = useState("");

  // ✅ Fetch the service request by ID
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await apiClient.get(`/serviceRequest/${id}`);
        const data = res.data.data;
        setRequest(data);
        setEditAttachments(data.attachments || []);
        setEditInfo({
          status: data.status || "",
          postDate: new Date(data.createdAt).toLocaleDateString(),
          preferredTime: data.preferredTime
            ? `${data.preferredTime.from} - ${data.preferredTime.to}`
            : "",
          cost: data.price ? `${data.price} ` : "",
          currency: data.currency || "",
          specialty: data.subSpecialty?.specialty?.name || "",
        });
        setEditDetails({
          description: data.description || "",
        });
        setEditRequirements(
       data?.requirements || []
      );
      } catch (err) {
        console.error("Error fetching request:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRequest();
  }, [id]);

  // ✅ Update request
  const handleUpdate = async (data: any) => {
    try {
      const res = await apiClient.put(`/serviceRequest/${id}`, data);
      setRequest(res.data.data);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // ✅ Delete request
  const handleDelete = async () => {
    try {
      await apiClient.delete(`/serviceRequest/${id}`);
      window.location.href = "/ServiceRequests";
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!request)
    return <div className="text-center mt-10">No request found.</div>;

  const client = {
    name: request.patientDetails?.name || "Unknown Client",
    registerDate: new Date(request.clientId?.createdAt).toLocaleDateString(),
    city: request.postalCode?.district?.city?.name || "Unknown City",
    email: request.clientId?.email || "N/A",
    medicalHistory: request.patientDetails?.medicalHistory || " ",
  };

  const offers = request.offers || [];

  // ---------------------- Edit Handlers ----------------------
  const handleEditInfoChange = (e: any) => {
    const { name, value } = e.target;
    setEditInfo((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSaveInfo = async () => {
    const updatedData = {
      status: editInfo.status,
      price: editInfo.cost,
    };
    await handleUpdate(updatedData);
    setIsEditingInfo(false);
  };

  const handleCancelInfo = () => {
    setIsEditingInfo(false);
  };

  const handleEditDetailsChange = (e: any) => {
    const { name, value } = e.target;
    setEditDetails((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSaveDetails = async () => {
    await handleUpdate({ description: editDetails.description });
    setIsEditingDetails(false);
  };

  const handleCancelDetails = () => {
    setEditDetails({ description: request.description });
    setIsEditingDetails(false);
  };


  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setEditRequirements((prev) => [...prev, newRequirement.trim()]);
      setNewRequirement("");
    }
  };

  const handleRemoveRequirement = (idx: number) => {
    setEditRequirements((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveRequirements = async () => {
    await handleUpdate({ requirements: editRequirements });
    setIsEditingRequirements(false);
  };


  const handleCancelRequirements = () => {
    setEditRequirements(request.requirements || []);
    setIsEditingRequirements(false);
  };



  const handleAddAttachment = (e: any) => {
    const files = Array.from(e.target.files) as File[];
    setEditAttachments((prev: any) => [
      ...prev,
      ...files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        file,
      })),
    ]);
  };

  const handleRemoveAttachment = (idx: any) => {
    setEditAttachments((prev: any) =>
      prev.filter((_: any, i: number) => i !== idx)
    );
  };

  const handleSaveAttachments = async () => {
    await handleUpdate({ attachments: editAttachments });
    setIsEditingAttachments(false);
  };

  const handleCancelAttachments = () => {
    setEditAttachments([...request.attachments]);
    setIsEditingAttachments(false);
  };

  const Status_color: Record<string, string> = {
    pending: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    started: "bg-yellow-100 text-yellow-700",
  };


    const renderRequirements = (reqs: any[]) => {
    if (!reqs || reqs.length === 0) return <div className="text-sm text-gray-700">None</div>;
    return (
      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
        {reqs.map((r: string, i: number) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    );
  };

  // ---------------------- Render ----------------------
  return (
    <div className="flex flex-col mx-[20px] mb-10">
      {/* Breadcrumb */}
      <nav
        className="flex items-center text-sm text-gray-500 mb-4"
        aria-label="Breadcrumb"
      >
        <Link href={"/overview"}>
          <span className="hover:underline cursor-pointer ">Home</span>
        </Link>
        <FiChevronRight className="mx-2" />
        <Link href={"/ServiceRequests"}>
          <span className="hover:underline cursor-pointer ">
            Service Requests
          </span>
        </Link>
        <FiChevronRight className="mx-2" />
        <span className="t">View</span>
      </nav>

      {/* Title & Buttons */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800 mb-2 md:mb-0">
          {request.title}
        </h1>
        <div className="flex gap-3">
          <Button
            className="border flex items-center gap-1 rounded text-secondary bg-secondary bg-opacity-10 hover:bg-secondary hover:bg-opacity-20 transition"
            title="Comment"
            onClick={() => {
              commentRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
              setTimeout(() => commentRef.current?.focus(), 400);
            }}
          >
            <FiMessageCircle />
            <span className="hidden sm:inline">Comment</span>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="flex items-center gap-1 px-4 py-2 rounded bg-red-100 text-red-600 hover:bg-red-200 transition"
                title="Delete"
              >
                <FiTrash2 />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-2">
                  <FiTrash2 className="text-2xl text-red-500" />
                </div>
                <AlertDialogTitle className="text-lg font-bold text-red-600">
                  Delete Request
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription className="text-center text-gray-600 mb-4">
                Are you sure you want to{" "}
                <span className="font-semibold text-red-500">delete</span> this
                request? <br />
                This action cannot be undone.
              </AlertDialogDescription>
              <AlertDialogFooter className="flex justify-center gap-2">
                <AlertDialogCancel className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDelete();
                  }}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column */}
        <div className="md:w-[28%] w-full space-y-5">
          {/* Request Info */}
          <div className="bg-white rounded-sm shadow p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium">Request Info</h2>
              {!isEditingInfo && (
                <button
                  className="text-xs px-2 py-1 rounded text-secondary border shadow hover:bg-secondary hover:bg-opacity-5"
                  onClick={() => setIsEditingInfo(true)}
                >
                  Update
                </button>
              )}
            </div>
            <div className="h-[1px] bg-gray-300 my-3 mb-4"></div>
            <div className="flex gap-[146px] text-sm">
              <div
                className={`${isEditingInfo ? "gap-4" : "gap-2"} flex flex-col`}
              >
                <span className="font-medium mb-2">Status </span>
                <span className="font-medium">Post Date </span>
                <span className="font-medium">Preferred Time</span>
                <span className="font-medium">Cost</span>
                <span className="font-medium">Specialty </span>
              </div>

              <div className="flex gap-2 flex-col">
                {isEditingInfo ? (
                  <>
                    <span
                      className={`${
                        Status_color[request.status]
                      }  px-2 py-1 inline-block mt-1   rounded   font-semibold`}
                    >
                      {request.status}
                    </span>

                    <input
                      name="postDate"
                      value={editInfo.postDate}
                      onChange={handleEditInfoChange}
                      className="px-2 py-1 rounded border"
                    />
                    <input
                      name="preferredTime"
                      value={editInfo.preferredTime}
                      onChange={handleEditInfoChange}
                      className="px-2 py-1 rounded border"
                    />
                    <input
                      name="cost"
                      value={editInfo.cost || ""}
                      onChange={handleEditInfoChange}
                      className="px-2 py-1 rounded border"
                      placeholder="Cost"
                    />

                    <span className={`px-2 py-1 inline-block mt-1   `}>
                      {editInfo.specialty}
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      className={`${
                        Status_color[request.status]
                      } px-2 py-1 mb-2 rounded-full text-xs font-semibold`}
                    >
                      {request.status}
                    </span>

                    <span>{editInfo.postDate}</span>
                    <span>{editInfo.preferredTime}</span>
                    <span>
                      {editInfo.cost} {editInfo.currency}
                    </span>
                    <span>{editInfo.specialty}</span>
                  </>
                )}
              </div>
            </div>
            {isEditingInfo && (
              <div className="flex gap-2 mt-4">
                <Button variant={"submit"} onClick={handleSaveInfo}>
                  Save
                </Button>
                <Button variant={"cancel"} onClick={handleCancelInfo}>
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Client Details */}
          <div className="bg-white rounded-sm shadow p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium">Client Details</h2>
              <Link href={`/users/view/${request.clientId._id}`}>
                <button className="text-xs px-2 py-1 rounded text-secondary border shadow hover:bg-secondary hover:bg-opacity-10">
                  View
                </button>
              </Link>
            </div>
            <div className="h-[1px] bg-gray-300 my-3"></div>
            <div className="space-y-3 text-sm">
              <div>
                {client.name}
                <span className="flex items-center gap-1 text-gray-500 text-xs">
                  <FaBriefcase /> Doctor
                </span>
              </div>
              <div className="flex gap-20">
                <div className="flex flex-col gap-2">
                  <span className="font-medium">Register</span>
                  <span className="font-medium">Email</span>
                  <span className="font-medium">City</span>
                  <span className="font-medium">MedicalHistory</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span>{client.registerDate}</span>
                  <span>{client.email}</span>
                  <span>{client.city}</span>
                  <span>{client.medicalHistory}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comment */}
          <div className="bg-white rounded-sm shadow p-4 mt-8">
            <h2 className="text-base font-medium mb-2">Leave a Comment</h2>
            <textarea
              ref={commentRef}
              className="w-full min-h-[255px] border rounded p-2 focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="Write your comment here..."
            />
            <Button variant={"submit"} className="mt-2">
              Send
            </Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 w-full space-y-5">
          {/* Request Details */}
          <div className="bg-white rounded-sm shadow p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium">Request Details</h2>
              {!isEditingDetails && (
                <button
                  className="text-xs px-2 py-1 rounded text-secondary border shadow hover:bg-secondary hover:bg-opacity-5"
                  onClick={() => setIsEditingDetails(true)}
                >
                  Update
                </button>
              )}
            </div>
            <div className="h-[1px] bg-gray-300 my-3"></div>
            {isEditingDetails ? (
              <div>
                <textarea
                  name="description"
                  value={editDetails.description}
                  onChange={handleEditDetailsChange}
                  className="w-full min-h-[120px] border rounded p-2 mb-2"
                />
                <div className="flex gap-2">
                  <Button variant={"submit"} onClick={handleSaveDetails}>
                    Save
                  </Button>
                  <Button variant={"cancel"} onClick={handleCancelDetails}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mb-2">{request.description}</div>
            )}
          </div>

          {/* Attachments */}
          <div className="bg-white rounded-sm shadow p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium">Attachments</h2>
              {!isEditingAttachments && (
                <button
                  className="text-xs px-2 py-1 rounded text-secondary border shadow hover:bg-secondary hover:bg-opacity-5"
                  onClick={() => setIsEditingAttachments(true)}
                >
                  Update
                </button>
              )}
            </div>
            <div className="h-[1px] bg-gray-300 my-3"></div>
            {isEditingAttachments ? (
              <div>
                <ul className="list-disc pl-5 space-y-1 mb-2">
                  {editAttachments.map((att, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <a
                        href={att.url}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {att.name}
                      </a>
                      <button
                        className="text-xs text-red-500 hover:underline"
                        onClick={() => handleRemoveAttachment(idx)}
                        type="button"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mb-6">
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleAddAttachment}
                    className="hidden"
                  />
                </div>
                <div className="flex gap-2">
                  <label
                    htmlFor="file-upload"
                    className="px-4 py-1 rounded bg-secondary text-white flex items-center text-sm hover:bg-secondary/90 hover:cursor-pointer"
                  >
                    <FiUpload className="mr-2 text-sm" />
                    Add Files
                  </label>
                  <Button variant={"submit"} onClick={handleSaveAttachments}>
                    Save
                  </Button>
                  <Button variant={"cancel"} onClick={handleCancelAttachments}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                {request.attachments?.map((att: any, idx: number) => (
                  <li key={idx}>
                    <a
                      href={att.url}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {att.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

           {/* Requirements */}
            <div className="bg-white rounded-sm shadow p-4">
               <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Requirements</h3>
              {!isEditingRequirements && (
                <button
                  className="text-xs px-2 py-1 rounded text-secondary border shadow hover:bg-secondary hover:bg-opacity-5"
                  onClick={() => setIsEditingRequirements(true)}
                >
                  Update
                </button>
              )}</div>
                          <div className="h-[1px] bg-gray-300 my-3"></div>
       

            {!isEditingRequirements ? (
              <div className="mb-3">{renderRequirements(request.requirements)}</div>
            ) : (
              <div className="mb-3">
                {editRequirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <input
                      value={req}
                      onChange={(e) => {
                        const updated = [...editRequirements];
                        updated[i] = e.target.value;
                        setEditRequirements(updated);
                      }}
                      className="flex-1 px-2 py-1 border rounded"
                    />
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveRequirement(i)}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2 mb-2">
                  <input
                    placeholder="Add new requirement..."
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded"
                  />
                  <Button variant="submit" onClick={handleAddRequirement}>
                    Add
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="submit" onClick={handleSaveRequirements}>
                    Save
                  </Button>
                  <Button variant="cancel" onClick={handleCancelRequirements}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
                 </div>

          {/* Offers */}
          <div className="bg-white rounded-sm shadow p-4">
            <h2 className="text-base font-medium">Provider Offers</h2>

            <div className="h-[1px] bg-gray-300 my-3"></div>
            <ul className="space-y-4">
              {offers.map((offer: any, idx: number) => {
                const provider = offer.providerId;
                const isAssigned = request.acceptedOffer?._id === offer._id;
                return (
                  <li
                    key={idx}
                    className={`border rounded p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4 bg-gray-50 ${
                      isAssigned ? "border-secondary bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-4 min-w-[220px]">
                        {provider?.image?.url ? (
                          <img
                            src={provider?.image?.url}
                            alt={provider?.firstName}
                            className="w-12 h-12 rounded-full object-cover border"
                          />
                        ) : (
                          <span className="w-12 h-12 rounded-full text-xl items-center flex justify-center uppercase border bg-white">
                            {" "}
                            {provider?.firstName?.charAt(0)}
                          </span>
                        )}

                        <div>
                          <div className="font-semibold text-gray-800 flex items-center gap-2">
                            <Link href={`/users/view/${provider?._id}`}>
                              <span className="hover:text-secondary hover:cursor-pointer">
                                {provider?.firstName} {provider?.lastName}
                              </span>
                            </Link>
                          </div>
                          <div className="text-xs text-gray-500">
                            {provider?.subSpecialty?.[0].name || "Specialist"}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-end gap-1 min-w-[90px]">
                        {isAssigned ? (
                          <span className="ml-2 px-2 py-0.5 rounded bg-secondary text-white text-xs">
                            Working
                          </span>
                        ) : (
                          <span
                            className={` ${
                              Status_color[request?.status || "pending"]
                            } inline-block mt-1 px-2 py-1 rounded  text-xs font-semibold`}
                          >
                            {request?.status
                              ? request.status.charAt(0).toUpperCase() +
                                request.status.slice(1)
                              : ""}
                          </span>
                        )}
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-secondary">
                            {offer.price} {request.currency}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(offer.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 text-gray-600 text-sm break-words">
                      {offer.message}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
