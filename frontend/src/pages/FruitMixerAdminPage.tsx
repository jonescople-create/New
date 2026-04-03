import { setupPageSEO } from '../utils/seo';
import { useEffect, useMemo, useState } from "react";
import { navigate } from "../App";
import { Breadcrumb } from "../components/Breadcrumb";
import { loadUserMixes, updateMixStatus, type MixStatus, type UserMix } from "../utils/fruitMixer";
import { withRuntimeMeta } from "../utils/runtimeMeta";

const STATUS: MixStatus[] = ["draft", "submitted", "approved", "rejected"];

export function FruitMixerAdminPage() {
  const [filter, setFilter] = useState<MixStatus | "all">("submitted");
  const [mixes, setMixes] = useState<UserMix[]>([]);

  useEffect(() => {
    setupPageSEO({
      path: '/fruit-mixer',
      title: 'Tropical Fruit Mixer — Create & Save Custom Blends | IslandFruitGuide',
      description: 'Create and save your own tropical fruit blend combinations. Mix Caribbean fruits, discover flavour profiles, and save your favourite recipes.',
    });
  }, []);

  useEffect(() => {
    const restore = withRuntimeMeta(
      {
        title: "Fruit Mixer Admin — IslandFruitGuide",
        robots: "noindex,nofollow",
        canonical: "https://islandfruitguide.com/fruit-mixer",
      },
      () => {
        setMixes(loadUserMixes());
      }
    );
    return restore;
  }, []);

  const visible = useMemo(() => {
    if (filter === "all") return mixes;
    return mixes.filter(m => m.status === filter);
  }, [filter, mixes]);

  const refresh = () => setMixes(loadUserMixes());

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-charcoal to-charcoal/90 text-white py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Fruit Mixer", path: "/fruit-mixer" }, { label: "Admin" }]} />
          <h1 className="font-heading text-3xl lg:text-4xl font-bold">Fruit Mixer Admin</h1>
          <p className="text-white/80 mt-2 text-lg max-w-2xl">
            Local-only admin panel (WordPress-ready model). Approve/reject mixes, mark Chef’s Picks, lock unsafe combinations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-charcoal-light">Filter:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
              >
                <option value="all">All</option>
                {STATUS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={refresh} className="btn-secondary">Refresh</button>
              <button onClick={() => navigate("/fruit-mixer")} className="btn-primary">Back to Mixer</button>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-charcoal">
                  <th className="py-2 pr-4">Mix</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Flags</th>
                  <th className="py-2 pr-4">Updated</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map(m => (
                  <tr key={m.id} className="border-t border-gray-100">
                    <td className="py-3 pr-4">
                      <button onClick={() => navigate(`/fruit-mixer/mix/${m.id}`)} className="font-semibold text-leaf hover:text-leaf/80">
                        {m.recipe.title}
                      </button>
                      <div className="text-xs text-charcoal-light">{m.id}</div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full font-semibold">{m.status}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-2">
                        {m.chefsPick && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-semibold">Chef’s Pick</span>}
                        {m.lockedUnsafe && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-semibold">Locked</span>}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-charcoal-light">{new Date(m.updatedAt).toLocaleString()}</td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="text-xs bg-leaf text-white px-3 py-1.5 rounded-lg font-semibold"
                          onClick={() => { updateMixStatus(m.id, { status: "approved" }); refresh(); }}
                        >
                          Approve
                        </button>
                        <button
                          className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-semibold"
                          onClick={() => { updateMixStatus(m.id, { status: "rejected" }); refresh(); }}
                        >
                          Reject
                        </button>
                        <button
                          className="text-xs bg-mango text-charcoal px-3 py-1.5 rounded-lg font-semibold"
                          onClick={() => { updateMixStatus(m.id, { chefsPick: !m.chefsPick }); refresh(); }}
                        >
                          Chef’s Pick
                        </button>
                        <button
                          className="text-xs bg-gray-800 text-white px-3 py-1.5 rounded-lg font-semibold"
                          onClick={() => { updateMixStatus(m.id, { lockedUnsafe: !m.lockedUnsafe }); refresh(); }}
                        >
                          Lock
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-charcoal-light">
                      No mixes found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            Admin URLs are not included in sitemap and are marked <strong>noindex, nofollow</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
